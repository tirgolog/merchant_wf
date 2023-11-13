import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Currency } from '../currencies/currency.entity';
import { CargoType } from '../cargo-type/cargo-type.entity';
import { TransportType } from '../transport-type/transport-type.entity';
import { Merchant } from '../merchants/entities/merchant.entity';

@Entity()
export class Cargo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  sendLocation: string;

  cargoDeliveryLocation?: string;

  @ManyToOne(() => TransportType, (transportType) => transportType.cargo, { nullable: false })
  transportType: string;

  @ManyToOne(() => CargoType, (cargoType) => cargoType.cargo, { nullable: false })
  cargoType: string;

  @Column({ nullable: false })
  sendCargoDate: Date;

  @Column({ nullable: false })
  sendCargoTime: string;

  @ManyToOne(() => Currency, (currency) => currency.cargo)
  currency?: string;

  @Column({ nullable: true })
  offeredPrice?: number;

  @Column({ nullable: true })
  cargoWeight?: number;

  @Column({ nullable: true })
  cargoLength?: number;

  @Column({ nullable: true })
  cargoWidth?: number;

  @Column({ nullable: true })
  cargoHeight?: number;

  @Column({ nullable: true })
  isDangrousCargo?: boolean;

  @Column({ nullable: true })
  isCashlessPayment?: boolean

  @Column({ nullable: true })
  isUrgent?: boolean;

  @Column({ default: new Date() })
  createdAt?: Date;

  @ManyToOne(() => Merchant, (merchant) => merchant.cargos, { nullable: false })
  merchant: string;

  @ManyToOne(() => User, (user) => user.cargo)
  createdBy?: string;

  @Column({ default: 'Создан' })
  status?: string;

  @Column({ default: true })
  active?: boolean;
}
