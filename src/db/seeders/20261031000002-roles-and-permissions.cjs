'use strict';

const { QueryTypes } = require('sequelize');

const roles = [
  {
    name: 'Administrador',
    slug: 'admin',
    description: 'Acceso completo a la administración del foro.',
    is_system: true,
  },
  {
    name: 'Moderador',
    slug: 'moderator',
    description: 'Revisa reportes y modera publicaciones y comentarios.',
    is_system: true,
  },
  {
    name: 'Miembro',
    slug: 'member',
    description: 'Rol por defecto para las personas registradas.',
    is_system: true,
  },
];

const permissions = [
  ['Crear publicaciones', 'publications:create', 'Publicar platos y recetas.'],
  ['Editar publicaciones propias', 'publications:update:own', 'Editar publicaciones propias.'],
  ['Eliminar publicaciones propias', 'publications:delete:own', 'Eliminar publicaciones propias.'],
  ['Moderar publicaciones', 'publications:moderate', 'Editar o retirar publicaciones de cualquier usuario.'],
  ['Crear comentarios', 'comments:create', 'Comentar publicaciones.'],
  ['Moderar comentarios', 'comments:moderate', 'Editar o retirar comentarios de cualquier usuario.'],
  ['Crear calificaciones', 'ratings:create', 'Calificar publicaciones.'],
  ['Gestionar favoritos', 'favorites:manage', 'Guardar y quitar publicaciones favoritas.'],
  ['Gestionar usuarios', 'users:manage', 'Administrar cuentas y estados de usuario.'],
  ['Gestionar roles', 'roles:manage', 'Asignar roles y permisos.'],
  ['Gestionar categorías', 'categories:manage', 'Crear y editar categorías.'],
  ['Gestionar etiquetas', 'tags:manage', 'Crear y editar etiquetas.'],
  ['Verificar documentos', 'documents:verify', 'Revisar y verificar documentos de identidad.'],
  ['Gestionar reportes', 'reports:manage', 'Revisar y resolver reportes de contenido.'],
];

const rolePermissions = {
  admin: permissions.map(([, slug]) => slug),
  moderator: [
    'publications:moderate',
    'comments:moderate',
    'tags:manage',
    'reports:manage',
  ],
  member: [
    'publications:create',
    'publications:update:own',
    'publications:delete:own',
    'comments:create',
    'ratings:create',
    'favorites:manage',
  ],
};

const select = (queryInterface, sql, replacements = {}) =>
  queryInterface.sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements,
  });

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const existingRoles = await select(queryInterface, 'SELECT slug FROM roles');
    const existingRoleSlugs = new Set(existingRoles.map((role) => role.slug));
    const newRoles = roles.filter((role) => !existingRoleSlugs.has(role.slug));

    if (newRoles.length) {
      await queryInterface.bulkInsert(
        'roles',
        newRoles.map((role) => ({
          ...role,
          created_at: now,
          updated_at: now,
        }))
      );
    }

    const existingPermissions = await select(
      queryInterface,
      'SELECT slug FROM permissions'
    );
    const existingPermissionSlugs = new Set(
      existingPermissions.map((permission) => permission.slug)
    );
    const newPermissions = permissions.filter(
      ([, slug]) => !existingPermissionSlugs.has(slug)
    );

    if (newPermissions.length) {
      await queryInterface.bulkInsert(
        'permissions',
        newPermissions.map(([name, slug, description]) => ({
          name,
          slug,
          description,
          created_at: now,
          updated_at: now,
        }))
      );
    }

    const roleRows = await select(queryInterface, 'SELECT id, slug FROM roles');
    const permissionRows = await select(
      queryInterface,
      'SELECT id, slug FROM permissions'
    );
    const roleIds = new Map(roleRows.map((role) => [role.slug, role.id]));
    const permissionIds = new Map(
      permissionRows.map((permission) => [permission.slug, permission.id])
    );

    const existingLinks = await select(
      queryInterface,
      'SELECT role_id, permission_id FROM role_permissions'
    );
    const existingLinkKeys = new Set(
      existingLinks.map((link) => `${link.role_id}:${link.permission_id}`)
    );

    const newLinks = [];

    Object.entries(rolePermissions).forEach(([roleSlug, permissionSlugs]) => {
      const roleId = roleIds.get(roleSlug);

      if (!roleId) {
        return;
      }

      permissionSlugs.forEach((permissionSlug) => {
        const permissionId = permissionIds.get(permissionSlug);

        if (
          permissionId &&
          !existingLinkKeys.has(`${roleId}:${permissionId}`)
        ) {
          newLinks.push({
            role_id: roleId,
            permission_id: permissionId,
            created_at: now,
            updated_at: now,
          });
        }
      });
    });

    if (newLinks.length) {
      await queryInterface.bulkInsert('role_permissions', newLinks);
    }

    const memberRoleId = roleIds.get('member');

    if (memberRoleId) {
      const usersWithoutRole = await select(
        queryInterface,
        `SELECT u.id
         FROM users u
         WHERE NOT EXISTS (
           SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id
         )`
      );

      if (usersWithoutRole.length) {
        await queryInterface.bulkInsert(
          'user_roles',
          usersWithoutRole.map((user) => ({
            user_id: user.id,
            role_id: memberRoleId,
            created_at: now,
            updated_at: now,
          }))
        );
      }
    }
  },

  async down(queryInterface) {
    const roleRows = await select(
      queryInterface,
      "SELECT id FROM roles WHERE slug IN ('admin', 'moderator', 'member')"
    );
    const roleIds = roleRows.map((role) => role.id);

    if (roleIds.length) {
      await queryInterface.bulkDelete('user_roles', { role_id: roleIds });
      await queryInterface.bulkDelete('role_permissions', { role_id: roleIds });
    }

    await queryInterface.bulkDelete('roles', {
      slug: ['admin', 'moderator', 'member'],
    });
    await queryInterface.bulkDelete('permissions', {
      slug: permissions.map(([, slug]) => slug),
    });
  },
};
