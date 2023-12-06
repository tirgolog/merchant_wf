// file-upload.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { RabbitMQService } from '../services/rabbitmq.service';
import { CargosModule } from 'src/main/cargo/cargo.module';

@Module({
  imports: [forwardRef(() => CargosModule)],
  providers: [RabbitMQService],
  exports: [RabbitMQService]
})
export class SharedModule {}
