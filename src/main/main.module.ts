import { Module } from "@nestjs/common";
import { CurrenciesModule } from "./currencies/currency.module";
import { MerchantsModule } from "./merchants/merchant.module";
import { RolesModule } from "./roles/role.module";
import { TransportTypesModule } from "./transport-type/transport-type.module";
import { UsersModule } from "./users/users.module";
import { CargosModule } from "./cargo/cargo.module";
import { TransactionsModule } from "./transaction/transaction.module";
import { CargoTypesModule } from "./cargo-type/cargo-type.module";

@Module({
    imports: [
        UsersModule,
        MerchantsModule,
        CurrenciesModule,
        RolesModule,
        TransportTypesModule,
        CargosModule,
        CargoTypesModule,
        TransactionsModule
    ],
    controllers: [
    ],
    providers: [
    ],
    exports: [
        UsersModule,
        MerchantsModule
    ]
})
export class MainModule {
}