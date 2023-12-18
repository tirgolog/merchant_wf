import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from "./transaction.controller";
import { Transaction } from "./transaction.entity";
import { TransactionService } from "./transaction.service";
import { SharedModule } from "src/shared/modules/shared.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Transaction]),
        SharedModule
    ],
    controllers: [
        TransactionController
    ],
    providers: [
        TransactionService
    ],
    exports: [
        TypeOrmModule.forFeature([Transaction]),
    ]
})
export class TransactionsModule {

}