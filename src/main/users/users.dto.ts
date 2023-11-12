
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateUserDto {

  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsUUID()
  merchantId: string;

  @IsNotEmpty()
  @IsUUID()
  role: string;

  @IsNotEmpty()
  password: string;

  // @IsEmail()
  // @IsNotEmpty()
  email?: string;
}

export class UpdateUserDto {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  email: string;

}