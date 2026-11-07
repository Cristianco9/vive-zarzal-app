import {
  Category,
  Comment,
  Favorite,
  Like,
  Publication,
  Rating,
  User,
} from '../db/models/index.js';
import { firstError, publicationSchema } from '../schemas/index.js';
import { httpError } from '../utils/httpError.js';
import {
  deleteStoredImage,
  deleteUploadedFile,
} from '../middlewares/upload.js';

export const publicationSummaryInclude = [
  {
    model: User,
    as: 'author',
    attributes: ['id', 'firstName', 'lastName', 'username'],
  },
  {
    model: Category,
    as: 'category',
    attributes: ['id', 'name', 'slug'],
  },
  {
    model: Like,
    as: 'likes',
    attributes: ['id', 'userId'],
  },
  {
    model: Rating,
    as: 'ratings',
    attributes: ['id', 'userId', 'score'],
  },
  {
    model: Comment,
    as: 'comments',
    attributes: ['id'],
  },
];

const publicationDetailInclude = [
  ...publicationSummaryInclude.filter((include) => include.as !== 'comments'),
  {
    model: Comment,
    as: 'comments',
    separate: true,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'firstName', 'lastName', 'username'],
      },
    ],
  },
];

export const toPublicationCard = (
  publication,
  currentUser,
  favoriteIds = new Set()
) => {
  const data = publication.get ? publication.get({ plain: true }) : publication;
  const likes = data.likes || [];
  const ratings = data.ratings || [];
  const comments = data.comments || [];
  const totalScore = ratings.reduce((sum, rating) => sum + rating.score, 0);

  return {
    ...data,
    likeCount: likes.length,
    ratingCount: ratings.length,
    ratingAverage: ratings.length
      ? Number((totalScore / ratings.length).toFixed(1))
      : 0,
    commentCount: comments.length,
    likedByCurrentUser: currentUser
      ? likes.some((like) => like.userId === currentUser.id)
      : false,
    favoritedByCurrentUser: currentUser ? favoriteIds.has(data.id) : false,
    currentUserRating: currentUser
      ? ratings.find((rating) => rating.userId === currentUser.id)?.score || null
      : null,
  };
};

export const toPublicationCards = async (publications, currentUser) => {
  const favoriteIds = new Set();

  if (currentUser && publications.length) {
    const favorites = await Favorite.findAll({
      where: {
        userId: currentUser.id,
        publicationId: publications.map((publication) => publication.id),
      },
      attributes: ['publicationId'],
    });

    favorites.forEach((favorite) => favoriteIds.add(favorite.publicationId));
  }

  return publications.map((publication) =>
    toPublicationCard(publication, currentUser, favoriteIds)
  );
};

const loadCategories = () =>
  Category.findAll({ order: [['name', 'ASC']] });

const findPublication = async (id) => {
  const publication = await Publication.findByPk(id);

  if (!publication) {
    throw httpError(404, 'Publicación no encontrada.');
  }

  return publication;
};

const assertOwner = (publication, user) => {
  if (publication.userId !== user.id) {
    throw httpError(403, 'No tienes permiso para modificar esta publicación.');
  }
};

export const listFeed = async (req, res) => {
  const [publications, categories] = await Promise.all([
    Publication.findAll({
      include: publicationSummaryInclude,
      order: [['createdAt', 'DESC']],
      limit: 30,
    }),
    loadCategories(),
  ]);

  return res.render('feed', {
    title: 'Inicio',
    publications: await toPublicationCards(publications, req.currentUser),
    categories,
  });
};

export const listByCategory = async (req, res) => {
  const category = await Category.findOne({ where: { slug: req.params.slug } });

  if (!category) {
    throw httpError(404, 'Categoría no encontrada.');
  }

  const publications = await Publication.findAll({
    where: { categoryId: category.id },
    include: publicationSummaryInclude,
    order: [['createdAt', 'DESC']],
  });

  return res.render('categoryFeed', {
    title: category.name,
    category,
    publications: await toPublicationCards(publications, req.currentUser),
  });
};

export const listFavorites = async (req, res) => {
  const favorites = await Favorite.findAll({
    where: { userId: req.currentUser.id },
    attributes: ['publicationId'],
    order: [['createdAt', 'DESC']],
  });

  const favoriteIds = new Set(
    favorites.map((favorite) => favorite.publicationId)
  );

  const publications = favoriteIds.size
    ? await Publication.findAll({
        where: { id: [...favoriteIds] },
        include: publicationSummaryInclude,
      })
    : [];

  const publicationsById = new Map(
    publications.map((publication) => [publication.id, publication])
  );

  const ordered = favorites
    .map((favorite) => publicationsById.get(favorite.publicationId))
    .filter(Boolean);

  return res.render('favorites', {
    title: 'Mis favoritos',
    publications: ordered.map((publication) =>
      toPublicationCard(publication, req.currentUser, favoriteIds)
    ),
  });
};

export const showCreate = async (req, res) => {
  const categories = await loadCategories();

  return res.render('publicationForm', {
    title: 'Nueva publicación',
    mode: 'create',
    categories,
    values: { type: 'dish' },
  });
};

export const create = async (req, res) => {
  const categories = await loadCategories();
  const { error, value } = publicationSchema.validate(req.body, {
    abortEarly: false,
  });

  const renderWithError = (message, status = 400) => {
    deleteUploadedFile(req.file);
    return res.status(status).render('publicationForm', {
      title: 'Nueva publicación',
      mode: 'create',
      categories,
      values: req.body,
      error: message,
    });
  };

  if (error) {
    return renderWithError(firstError(error));
  }

  if (!categories.some((category) => category.id === value.categoryId)) {
    return renderWithError('La categoría seleccionada no es válida.');
  }

  const publication = await Publication.create({
    userId: req.currentUser.id,
    categoryId: value.categoryId,
    type: value.type,
    title: value.title,
    description: value.description,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    ingredients: value.type === 'recipe' ? value.ingredients : null,
    instructions: value.type === 'recipe' ? value.instructions : null,
  });

  return res.redirect(
    `/publications/${publication.id}?success=${encodeURIComponent('Publicación creada.')}`
  );
};

export const showDetail = async (req, res) => {
  const publication = await Publication.findByPk(req.params.id, {
    include: publicationDetailInclude,
  });

  if (!publication) {
    throw httpError(404, 'Publicación no encontrada.');
  }

  const [card] = await toPublicationCards([publication], req.currentUser);

  return res.render('publicationDetail', {
    title: card.title,
    publication: card,
  });
};

export const showEdit = async (req, res) => {
  const publication = await findPublication(req.params.id);
  assertOwner(publication, req.currentUser);

  const categories = await loadCategories();

  return res.render('publicationForm', {
    title: 'Editar publicación',
    mode: 'edit',
    categories,
    values: publication.get({ plain: true }),
  });
};

export const update = async (req, res) => {
  const publication = await findPublication(req.params.id);
  assertOwner(publication, req.currentUser);

  const categories = await loadCategories();
  const { error, value } = publicationSchema.validate(req.body, {
    abortEarly: false,
  });

  const renderWithError = (message, status = 400) => {
    deleteUploadedFile(req.file);
    return res.status(status).render('publicationForm', {
      title: 'Editar publicación',
      mode: 'edit',
      categories,
      values: { ...publication.get({ plain: true }), ...req.body },
      error: message,
    });
  };

  if (error) {
    return renderWithError(firstError(error));
  }

  if (!categories.some((category) => category.id === value.categoryId)) {
    return renderWithError('La categoría seleccionada no es válida.');
  }

  const previousImage = publication.imageUrl;

  await publication.update({
    categoryId: value.categoryId,
    type: value.type,
    title: value.title,
    description: value.description,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : previousImage,
    ingredients: value.type === 'recipe' ? value.ingredients : null,
    instructions: value.type === 'recipe' ? value.instructions : null,
  });

  if (req.file && previousImage) {
    deleteStoredImage(previousImage);
  }

  return res.redirect(
    `/publications/${publication.id}?success=${encodeURIComponent('Publicación actualizada.')}`
  );
};

export const remove = async (req, res) => {
  const publication = await findPublication(req.params.id);
  assertOwner(publication, req.currentUser);

  deleteStoredImage(publication.imageUrl);
  await publication.destroy();

  return res.redirect(
    `/?success=${encodeURIComponent('Publicación eliminada.')}`
  );
};
