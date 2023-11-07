
import { IsNotEmpty } from "class-validator";

export class CreateUserDto {

  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
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