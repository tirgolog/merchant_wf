import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccount } from "./entities/bank-account.entity";
import { MerchantController } from "./merchant.controller";
import { Merchant } from "./entities/merchant.entity";
import { MerchantService } from "./merchant.service";
import { UsersModule } from "../users/users.module";
import { RolesModule } from "../roles/role.module";
import { CargosModule } from "../cargo/cargo.module";
import { TransactionsModule } from "../transaction/transaction.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Merchant]),
        TypeOrmModule.forFeature([BankAccount]),
        UsersModule,
        RolesModule,
        CargosModule,
        TransactionsModule
    ],
    controllers: [
        MerchantController
    ],
    providers: [
        MerchantService
    ],
    exports: [
        TypeOrmModule.forFeature([Merchant]),
        MerchantService
    ]
})
export class MerchantsModule {

}