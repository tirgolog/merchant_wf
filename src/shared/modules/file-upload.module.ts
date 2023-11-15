// file-upload.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from '../multer.config';
import { FileUploadController } from '../controllers/files/files.controller';

@Module({
  imports: [MulterModule.register(multerConfig)],
  controllers: [FileUploadController],
})
export class FileUploadModule {}
