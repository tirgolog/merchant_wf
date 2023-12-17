// upload.controller.ts
import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Get, Res, HttpStatus, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { multerConfig } from 'src/shared/multer.config';
import * as fs from 'fs';
import * as path from 'path';

@Controller('/api/v1/file')
export class FileUploadController {

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadFile(@UploadedFile() file: any) {
    // Handle the uploaded file
    return { filename: file.filename };
  }

  @Get('download/:filename')
  async downloadFile(@Param('filename') filename: string, @Res() res: Response): Promise<void> {
    const filePath = path.join(process.cwd(), '/uploads/', filename);
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      res.status(HttpStatus.NOT_FOUND).send('File not found');
      return;
    }

    // Serve the file as static content
    res.sendFile(filePath);
  }
}
