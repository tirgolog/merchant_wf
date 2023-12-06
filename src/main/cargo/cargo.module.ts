import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cargo } from "./cargo.entity";
import { CargoController } from "./cargo.controller";
import { CargosService } from "./cargo.service";
import { SharedModule } from "src/shared/modules/shared.module";
import { RabbitMQService } from "src/shared/services/rabbitmq.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Cargo]),
        forwardRef(() => SharedModule)
    ],
    controllers: [
        CargoController
    ],
    providers: [
        CargosService
    ],
    exports: [
        TypeOrmModule.forFeature([Cargo]),
        CargosService
    ]
})
export class CargosModule {

}