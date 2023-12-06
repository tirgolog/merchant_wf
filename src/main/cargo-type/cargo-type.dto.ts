
import { IsNotEmpty } from "class-validator";
import { PrimaryGeneratedColumn } from "typeorm";

export class CargoTypeDto {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: string;
  description?: string;

}
