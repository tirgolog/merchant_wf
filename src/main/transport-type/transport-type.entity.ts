import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Cargo } from '../cargo/cargo.entity';

@Entity()
export class TransportType {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users?: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Cargo, (cargo) => cargo.transportType)
  cargo: string;

  @Column({ default: new Date() })
  createdAt?: Date;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ default: true })
  active?: boolean;
}
