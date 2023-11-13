
import { IsNotEmpty, IsUUID } from "class-validator";
import { PrimaryGeneratedColumn } from "typeorm";

export class TransactionDto {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @IsNotEmpty()
  transactionType: string;

  @IsNotEmpty()
  amount: number;

  @IsUUID()
  @IsNotEmpty()
  merchantId: string;

}
