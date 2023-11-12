import { Module } from "@nestjs/common";
import { CurrenciesModule } from "./currencies/currency.module";
import { MerchantsModule } from "./merchants/merchant.module";
import { RolesModule } from "./roles/role.module";
import { TransportTypesModule } from "./transport-type/transport-type.module";
import { UsersModule } from "./users/users.module";
import { CargosModule } from "./cargo/cargo.module";

@Module({
    imports: [
        UsersModule,
        MerchantsModule,
        CurrenciesModule,
        RolesModule,
        TransportTypesModule,
        CargosModule
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