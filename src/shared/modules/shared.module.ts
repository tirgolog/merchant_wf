// file-upload.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { RabbitMQService } from '../services/rabbitmq.service';
import { CargosModule } from 'src/main/cargo/cargo.module';
import { SseController } from '../controllers/sse/sse.controller';
import { SseGateway } from '../gateway/sse.gateway';
import { MailService } from '../services/mail.service';

@Module({
  imports: [forwardRef(() => CargosModule)],
  providers: [
    RabbitMQService,
    SseGateway,
    MailService
  ],
  exports: [
    RabbitMQService,
    SseGateway,
    MailService
  ],
  controllers: [SseController]
})
export class SharedModule {}
