
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { PrimaryGeneratedColumn } from "typeorm";

export class MerchantDto {

  id?: number;

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
  dunsNumber?: number;
  supervisorFullName?: string;
  legalAddress?: string;
  factAddress?: string;
  bankName?: string;
  bankAccounts?: iBankAccount[];
  verifiedBy?: string;
}

export class CompleteMerchantDto {

  id?: number;

  @IsString()
  @IsNotEmpty()
  responsiblePerson: string;

  @IsString()
  @IsNotEmpty()
  registrationCertificateFilePath?: string;

  @IsString()
  @IsNotEmpty()
  passportFilePath?: string;

  @IsString()
  @IsNotEmpty()
  logoFilePath?: string;


  notes?: string;
  dunsNumber?: number;
  ibanNumber?: number;

  @IsString()
  @IsNotEmpty()
  mfo?: string;

  @IsString()
  @IsNotEmpty()
  inn?: string;

  @IsString()
  @IsNotEmpty()
  oked?: string;

  @IsString()
  @IsNotEmpty()
  supervisorFullName?: string;

  @IsString()
  @IsNotEmpty()
  legalAddress?: string;

  @IsString()
  @IsNotEmpty()
  factAddress?: string;

  @IsString()
  @IsNotEmpty()
  bankName?: string;

  bankAccounts?: iBankAccount[];
}

export interface iBankAccount {
  account: string;
  currency: number;
}