import { CargoType } from "./cargo-type/cargo-type.entity";
import { Cargo } from "./cargo/cargo.entity";
import { Currency } from "./currencies/currency.entity";
import { Transaction } from "./transaction/transaction.entity";
import { BankAccount } from "./merchants/entities/bank-account.entity";
import { Merchant } from "./merchants/entities/merchant.entity";
import { Role } from "./roles/role.entity";
import { TransportType } from "./transport-type/transport-type.entity";
import { User } from "./users/user.entity";

const entities = [
  User,
  Merchant,
  BankAccount,
  Currency,
  Role,
  TransportType,
  CargoType,
  Cargo,
  Transaction
];

export {
  User,
  Merchant,
  BankAccount,
  Currency,
  Role,
  TransportType,
  CargoType,
  Cargo,
  Transaction
};
export default entities;

export class BpmResponse {
  success: boolean;
  data: any;
  errors: string[];
  constructor(success: boolean, data: any, errors?: string[]) {
      this.success = success;
      this.data = data;
      this.errors = errors;
  }
}

export enum ResponseStauses {
  NotFound = 'Data not found',
  SuccessfullyCreated = 'Data successfully created',
  SuccessfullyUpdated = 'Data successfully updated',
  SuccessfullyDeleted = 'Data successfully deleted',
  CreateDataFailed = 'Create data failed',
  SendCodeFailed = 'Send code failed',
  UpdateDataFailed = 'Update data falied',
  DeleteDataFailed = 'Delete data falied',
  ExistingData = 'Existing data',
  DataContains = 'Data Contains'
} 