// file-upload.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { RabbitMQService } from '../services/rabbitmq.service';
import { CargosModule } from 'src/main/cargo/cargo.module';
import { SseController } from '../controllers/sse/sse.controller';
import { SseGateway } from '../gateway/sse.gateway';

@Module({
  imports: [forwardRef(() => CargosModule)],
  providers: [
    RabbitMQService,
    SseGateway
  ],
  exports: [
    RabbitMQService,
    SseGateway
  ],
  controllers: [SseController]
})
export class SharedModule {}
