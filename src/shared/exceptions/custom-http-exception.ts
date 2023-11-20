import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(message: string, status: HttpStatus, details?: any) {
    super({ message, details }, status);
  }
}
