import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Merchant, Currency } from '../..';

@Entity()
export class BankAccount {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  merchantId: number;

  @Column({ nullable: false })
  account: string;

  @ManyToOne(() => Currency, (currency) => currency.bankAccount)
  currency: string;

  @ManyToOne(() => Merchant, (merchant) => merchant.bankAccounts)
  merchant: Merchant;

  @Column({ default: new Date() })
  createdAt?: Date;

  @Column({ default: true })
  active?: boolean;
}
