import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportTypeController } from "./transport-type.controller";
import { TransportType } from "./transport-type.entity";
import { TransportTypesService } from "./transport-type.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([TransportType]),
    ],
    controllers: [
        TransportTypeController
    ],
    providers: [
        TransportTypesService
    ],
    exports: [
        TypeOrmModule.forFeature([TransportType]),
        TransportTypesService
    ]
})
export class TransportTypesModule {

}