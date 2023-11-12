import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BankAccount } from '../merchants/entities/bank-account.entity';
import { User } from '../users/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: new Date() })
  createdAt?: Date;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ default: true })
  active?: boolean;
}
