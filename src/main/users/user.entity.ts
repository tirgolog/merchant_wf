import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Currency } from '../currencies/currency.entity';
import { Merchant } from '../merchants/entities/merchant.entity';
import { Role } from '../roles/role.entity';
import { Cargo } from '../cargo/cargo.entity';
import { Transaction } from '../transaction/transaction.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: false })
  password: string;

  @ManyToOne(() => Role, (role) => role.users)
  role: string;

  @Column({ nullable: true })
  email?: string;

  @ManyToOne(() => Merchant, (merchant) => merchant.users)
  merchant: number;

  @OneToMany(() => Currency, (currency) => currency.createdBy)
  currencies?: string;

  @OneToMany(() => Cargo, (cargo) => cargo.createdBy)
  cargo?: string;

  @OneToMany(() => Transaction, (finance) => finance.createdBy)
  transactions?: string;

  @Column({ default: new Date() })
  createdAt?: Date;

  @Column({ default: new Date() })
  lastLogin?: Date;

  @Column({ default: true })
  active?: boolean;
  
  @Column({ default: false })
  disabled?: boolean;
}
