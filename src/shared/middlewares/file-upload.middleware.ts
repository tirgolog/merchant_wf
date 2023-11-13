// file-upload.middleware.ts
import * as multer from 'multer';

export const multerOptions: multer.Options = {
  storage: multer.memoryStorage(),
};

export const fileUploadMiddleware = multer(multerOptions);
