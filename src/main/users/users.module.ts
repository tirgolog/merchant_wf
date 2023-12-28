import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "./user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { SharedModule } from "src/shared/modules/shared.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        SharedModule
    ],
    controllers: [
        UsersController,
    ],
    providers: [
        UsersService,
    ],
    exports: [
        TypeOrmModule.forFeature([User]),
        UsersService
    ]
})
export class UsersModule {

}