import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { CargoTypeController } from "./cargo-type.controller";
import { CargoType } from "./cargo-type.entity";
import { CargoTypesService } from "./cargo-type.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([CargoType]),
    ],
    controllers: [
        CargoTypeController
    ],
    providers: [
        CargoTypesService
    ],
    exports: [
        TypeOrmModule.forFeature([CargoType]),
        CargoTypesService
    ]
})
export class CargoTypesModule {

}