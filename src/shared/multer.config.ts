// multer.config.ts
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  dest: './uploads',
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = extname(file.originalname);
      callback(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB (adjust the limit as needed)
  },
};