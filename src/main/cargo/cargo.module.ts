import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cargo } from "./cargo.entity";
import { CargoController } from "./cargo.controller";
import { CargosService } from "./cargo.service";
import { SharedModule } from "src/shared/modules/shared.module";
import { RabbitMQService } from "src/shared/services/rabbitmq.service";
import { TransportTypesModule } from "../transport-type/transport-type.module";
import { Transaction } from "../transaction/transaction.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Cargo, Transaction]),
        forwardRef(() => SharedModule),
        TransportTypesModule
    ],
    controllers: [
        CargoController
    ],
    providers: [
        CargosService
    ],
    exports: [
        TypeOrmModule.forFeature([Cargo, Transaction]),
        CargosService
    ]
})
export class CargosModule {

}