
import { IsNotEmpty } from "class-validator";
import { PrimaryGeneratedColumn } from "typeorm";

export class TransactionDto {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @IsNotEmpty()
  transactionType: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  merchantId: number;

}
