
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

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
  companyType: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  responsiblePersonLastName: string;
  responsiblePersonFistName: string;


  registrationCertificateFilePath?: string;
  passportFilePath?: string;
  logoFilePath?: string;
  notes?: string;
  mfo?: string;
  inn?: string;
  oked?: string;
  dunsNumber?: number;
  supervisorFirstName?: string;
  supervisorLastName?: string;
  legalAddress?: string;
  factAddress?: string;
  bankName?: string;
  bankAccounts?: iBankAccount[];
  verifiedBy?: string;
}

export class CompleteMerchantDto {

  @IsString()
  @IsNotEmpty()
  id?: number;

  @IsString()
  @IsNotEmpty()
  responsiblePersonLastName: string;

  @IsString()
  @IsNotEmpty()
  responsiblePersonFistName: string;

  @IsString()
  @IsNotEmpty()
  registrationCertificateFilePath?: string;

  @IsString()
  @IsNotEmpty()
  passportFilePath?: string;

  @IsString()
  @IsNotEmpty()
  logoFilePath?: string;

  taxPayerCode?: string;

  @IsString()
  @IsNotEmpty()
  responsbilePersonPhoneNumber?: string;


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
  supervisorFirstName?: string;

  @IsString()
  @IsNotEmpty()
  supervisorLastName?: string;

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