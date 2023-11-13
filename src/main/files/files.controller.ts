// your.controller.ts
import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileUploadInterceptor } from 'src/shared/interceptors/file-upload.interceptor';
import { fileUploadMiddleware } from 'src/shared/middlewares/file-upload.middleware';

@Controller('files')
export class YourController {
  @Post('upload')
  @UseInterceptors(new FileUploadInterceptor(fileUploadMiddleware))
  async uploadFile(@UploadedFile() file: File) {
    // Handle the uploaded file here
    console.log(file);

    return 'File uploaded successfully';
  }
}
``