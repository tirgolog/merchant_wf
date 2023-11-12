
import { IsNotEmpty } from "class-validator";
import { PrimaryGeneratedColumn } from "typeorm";

export class CurrencyDto {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @IsNotEmpty()
  name: string;

}
