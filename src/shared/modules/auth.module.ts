import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MainModule } from 'src/main/main.module';
import { AuthController } from '../controllers/auth/auth.controller';
import { FilesController } from '../controllers/files/files.controller';
import { AuthGuard } from '../guards/auth/auth.guard';
import { AuthService } from '../services/auth/auth.service';
import { FilesService } from '../services/file.service';

@Module({
  imports: [
    MainModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [
    AuthService,
    JwtService,
    FilesService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  
  ],
  controllers: [AuthController, FilesController],
  exports: [AuthService]
})
export class AuthModule {}