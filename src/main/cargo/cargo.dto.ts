
import { IsNotEmpty, IsUUID } from "class-validator";
import { PrimaryGeneratedColumn } from "typeorm";

export class CargoDto {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @IsNotEmpty()
  sendLocation: string;

  cargoDeliveryLocation?: string;

  @IsUUID()
  @IsNotEmpty()
  transportTypeId: string;
 
  @IsUUID()
  @IsNotEmpty()
  cargoTypeId: string;

  @IsNotEmpty()
  sendCargoDate: Date;
  
  @IsNotEmpty()
  sendCargoTime: string;

  @IsUUID()
  currencyId?: string;
  offeredPrice?: number;
  cargoWeight?: number;
  cargoLength?: number;
  cargoWidth?: number;
  cargoHeight?: number;
  isDangrousCargo?: boolean;
  isCashlessPayment?: boolean
  isUrgent?: boolean;

}
