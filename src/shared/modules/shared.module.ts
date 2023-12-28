// file-upload.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { RabbitMQService } from '../services/rabbitmq.service';
import { CargosModule } from 'src/main/cargo/cargo.module';
import { SseController } from '../controllers/sse/sse.controller';
import { SseGateway } from '../gateway/sse.gateway';
import { MailService } from '../services/mail.service';
import { Config } from '../entities/config.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsService } from '../services/sms.service';

@Module({
  imports: [
    forwardRef(() => CargosModule),
    TypeOrmModule.forFeature([Config]),
  ],
  providers: [
    RabbitMQService,
    SseGateway,
    MailService,
    SmsService
  ],
  exports: [
    RabbitMQService,
    SseGateway,
    MailService,
    SmsService,
    TypeOrmModule.forFeature([Config]),
  ],
  controllers: [SseController]
})
export class SharedModule {}
