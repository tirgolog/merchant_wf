import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BankAccount } from './bank-account.entity';
import { User } from 'src/main/users/user.entity';

@Entity()
export class Merchant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column("text", { nullable: false, array: true, default: [] })
  phoneNumbers: string[];

  @Column({ nullable: false })
  companyName: string;

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
  dunsNumber?: string;

  @Column({ nullable: true })
  supervisorFullName?: string;

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

  @Column({ default: false })
  verified?: boolean;

  @Column({ default: false })
  rejected?: boolean;

  @Column({ nullable: true })
  verifiedBy?: string;

  @Column({ default: new Date() })
  createdAt?: Date;

  @Column({ default: true })
  active?: boolean;
}
