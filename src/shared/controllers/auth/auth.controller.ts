import { Body, Controller, Post, HttpCode, HttpStatus, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/shared/filters/http-excecption.filter';
import { AuthService } from 'src/shared/services/auth/auth.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    ) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseFilters(new HttpExceptionFilter())
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
}