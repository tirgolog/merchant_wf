import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Currency } from '../currencies/currency.entity';
import { CargoType } from '../cargo-type/cargo-type.entity';
import { TransportType } from '../transport-type/transport-type.entity';
import { Merchant } from '../merchants/entities/merchant.entity';

@Entity()
export class Cargo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  sendLocation: string;

  @Column({ nullable: true })
  cargoDeliveryLocation?: string;

  @Column({ type: 'text', array: true, default: '{}' })
  transportTypes: string[]; //

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

  @Column({ nullable: true })
  start_lat?: string;

  @Column({ nullable: true })
  start_lng?: string;

  @Column({ nullable: true })
  finish_lat?: string;

  @Column({ nullable: true })
  finish_lng?: string;

  @Column({ default: new Date() })
  createdAt?: Date;

  @ManyToOne(() => Merchant, (merchant) => merchant.cargos, { nullable: false })
  merchant: number;

  @ManyToOne(() => User, (user) => user.cargo)
  createdBy?: string;

  @Column({ default: 0 })
  status?: number;

  @Column({ default: false })
  isSafe?: boolean;

  @Column({ default: true })
  active?: boolean;
}
