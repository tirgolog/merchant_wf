
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { PrimaryGeneratedColumn } from "typeorm";

export class MerchantDto {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  responsiblePerson: string;

  registrationCertificateFilePath?: string;
  passportFilePath?: string;
  logoFilePath?: string;
  notes?: string;
  mfo?: string;
  inn?: string;
  oked?: string;
  dunsNumber?: string;
  supervisorFullName?: string;
  legalAddress?: string;
  factAddress?: string;
  bankName?: string;
  bankAccounts?: iBankAccount[];
  verifiedBy?: string;
}

export interface iBankAccount {
  account: string;
  currency: number;
}