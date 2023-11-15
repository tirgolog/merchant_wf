// file-upload.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/shared/multer.config';

@Controller('api/v1/file/upload')
export class FileUploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadFile(@UploadedFile() file: File) {
    console.log(file);
    // You can perform additional operations with the uploaded file here
    return { message: 'File uploaded successfully' };
  }
}
