
import { IsNotEmpty } from "class-validator";
import { PrimaryGeneratedColumn } from "typeorm";

export class TransportTypeDto {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @IsNotEmpty()
  name: string;
  description?: string;

}
