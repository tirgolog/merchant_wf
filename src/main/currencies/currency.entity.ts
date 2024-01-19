import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BankAccount } from '../merchants/entities/bank-account.entity';
import { User } from '../users/user.entity';
import { Cargo } from '../cargo/cargo.entity';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  // @OneToMany(() => BankAccount, (bankAccount) => bankAccount.merchant)
  // bankAccounts?: number;

  @OneToMany(() => BankAccount, (bankAccount) => bankAccount.currency)
  bankAccount: string;

  @OneToMany(() => Cargo, (cargo) => cargo.currency)
  cargo: string;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @ManyToOne(() => User, (user) => user.currencies)
  createdBy?: string;

  @Column({ default: true })
  active?: boolean;
}
