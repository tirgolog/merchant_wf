import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BankAccount } from './bank-account.entity';
import { User } from 'src/main/users/user.entity';
import { Cargo } from 'src/main/cargo/cargo.entity';
import { Transaction } from 'src/main/transaction/transaction.entity';

@Entity()
export class Merchant {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: false })
  companyName: string;

  @Column({ nullable: true })
  responsiblePerson: string;

  @Column({ nullable: true })
  registrationCertificateFilePath?: string;

  @Column({ nullable: true })
  passportFilePath?: string;

  @Column({ nullable: true })
  logoFilePath?: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  mfo?: string;

  @Column({ nullable: true })
  inn?: string;

  @Column({ nullable: true })
  oked?: string;

  @Column({ nullable: true })
  dunsNumber?: number;

  @Column({ nullable: true })
  ibanNumber?: number;

  @Column({ nullable: true })
  supervisorFirstName?: string;

  @Column({ nullable: true })
  supervisorLastName?: string;

  @Column({ nullable: true })
  legalAddress?: string;

  @Column({ nullable: true })
  factAddress?: string;

  @Column({ nullable: true })
  bankName?: string;

  @OneToMany(() => BankAccount, (bankAccount) => bankAccount.merchant)
  bankAccounts?: number;
  
  @OneToMany(() => User, (user) => user.merchant)
  users?: string;

  @OneToMany(() => Cargo, (carrgo) => carrgo.merchant)
  cargos?: string;

  @OneToMany(() => Transaction, (finance) => finance.merchant)
  transactions?: string;

  @Column({ default: false })
  verified?: boolean;

  @Column({ default: false })
  rejected?: boolean;

  @Column({ nullable: true })
  verifiedBy?: string;

  @Column({ default: new Date() })
  createdAt?: Date;

  @Column({ default: false })
  completed?: boolean;

  @Column({ default: true })
  active?: boolean;
}
