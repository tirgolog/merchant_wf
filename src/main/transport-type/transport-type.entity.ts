import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Cargo } from '../cargo/cargo.entity';

@Entity()
export class TransportType {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  code: string;

  @OneToMany(() => User, (user) => user.role)
  users?: string;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ default: true })
  active?: boolean;
}
