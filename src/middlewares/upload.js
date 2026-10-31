import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { config } from '../config/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Solo se permiten imágenes JPG, PNG, WEBP o GIF');
    error.status = 400;
    return cb(error);
  }

  return cb(null, true);
};

export const uploadPublicationImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.uploadMaxSizeMb * 1024 * 1024 },
}).single('image');

export const deleteUploadedFile = (file) => {
  if (!file?.path) {
    return;
  }

  fs.unlink(file.path, () => {});
};

export const deleteStoredImage = (imageUrl) => {
  if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
    return;
  }

  const filePath = path.join(uploadsDir, path.basename(imageUrl));
  fs.unlink(filePath, () => {});
};
