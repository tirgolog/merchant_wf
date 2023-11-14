import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Merchant } from '../merchants/entities/merchant.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  transactionType: string;

  @Column({ nullable: false })
  amount: number;

  @ManyToOne(() => Merchant, (merchant) => merchant.transactions)
  merchant?: string;

  @Column({ default: false })
  verified?: boolean;

  @Column({ default: false })
  rejected?: boolean;

  @Column({ default: new Date() })
  createdAt?: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  createdBy?: string;

  @Column({ default: true })
  active?: boolean;
}
