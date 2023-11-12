import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cargo } from "./cargo.entity";
import { CargoController } from "./cargo.controller";
import { CargosService } from "./cargo.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Cargo]),
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