
import { IsNotEmpty } from "class-validator";
import { PrimaryGeneratedColumn } from "typeorm";

export class RoleDto {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @IsNotEmpty()
  name: string;
  description?: string;

}
