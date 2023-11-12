import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Currency } from '../currencies/currency.entity';
import { Merchant } from '../merchants/entities/merchant.entity';
import { Role } from '../roles/role.entity';
import { Cargo } from '../cargo/cargo.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ nullable: false })
  fullName: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @ManyToOne(() => Role, (role) => role.users)
  role: string;

  @Column({ nullable: true })
  email?: string;

  @ManyToOne(() => Merchant, (merchant) => merchant.users)
  merchant: string;

  @OneToMany(() => Currency, (currency) => currency.createdBy)
  currencies?: string;

  @OneToMany(() => Cargo, (cargo) => cargo.createdBy)
  cargo?: string;

  @Column({ default: new Date() })
  createdAt?: Date;

  @Column({ default: true })
  active?: boolean;
}
