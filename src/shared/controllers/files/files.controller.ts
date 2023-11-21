// file-upload.controller.ts
import { Controller, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/shared/multer.config';
import { Request } from "express";

@Controller('api/v1/file/upload')
export class FileUploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadFile(@UploadedFile() file: any, @Req() req: Request) {
    // console.log(file, req.body);
    // You can perform additional operations with the uploaded file here
    return { message: 'File uploaded successfully' };
  }
}
