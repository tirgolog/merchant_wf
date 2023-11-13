// file-upload.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Express } from 'express';
import * as multer from 'multer';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  constructor(private readonly upload: multer.Instance) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Express.Request>();

    return new Observable(observer => {
      this.upload.single('file')(request, null, async (err: any) => {
        if (err) {
          observer.error(err);
        } else {
          observer.next(request['file']);
          observer.complete();
        }
      });
    });
  }
}
