// your.controller.ts
import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileUploadInterceptor } from 'src/shared/interceptors/file-upload.interceptor';
import { fileUploadMiddleware } from 'src/shared/middlewares/file-upload.middleware';
import { FilesService } from '../../services/file.service';

@Controller('api/v1/files')
export class FilesController {

  constructor(
    private filesService: FilesService
  ) { }
  
  @Post('upload')
  @UseInterceptors(new FileUploadInterceptor(fileUploadMiddleware))
  async uploadFile(@UploadedFile() file: File) {
    console.log(file)
    // this.filesService.writeFile(file);
  }
}