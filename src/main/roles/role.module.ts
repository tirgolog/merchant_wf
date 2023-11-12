import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from "./role.controller";
import { Role } from "./role.entity";
import { RolesService } from "./role.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Role]),
    ],
    controllers: [
        RoleController
    ],
    providers: [
        RolesService
    ],
    exports: [
        TypeOrmModule.forFeature([Role]),
        RolesService
    ]
})
export class RolesModule {

}