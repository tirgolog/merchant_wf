
import { IsEmail, IsNotEmpty, IsUUID } from "class-validator";

export class CreateUserDto {

  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  merchantId: number;

  @IsNotEmpty()
  @IsUUID()
  role: string;

  @IsNotEmpty()
  password: string;

  // @IsEmail()
  // @IsNotEmpty()
  phoneNumber?: string;
}

export class UpdateUserDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsUUID()
  role: string;

  phoneNumber?: string;

}

export class SendCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class VerifyCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  code: string;
}

export class VerifyPhoneDto {
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  countryCode: string;
}