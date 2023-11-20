import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MainModule } from './main/main.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './main/index';
import { AuthModule } from './shared/modules/auth.module';
import { FileUploadModule } from './shared/modules/file-upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule
      ],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: entities,
        synchronize: true,
        autoLoadEntities: true,

      }),
      inject: [ConfigService],
    }),
    MainModule,
    AuthModule,
    FileUploadModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {
}
