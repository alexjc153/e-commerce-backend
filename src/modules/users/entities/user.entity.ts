import { Order } from '@orders/entities/order.entity';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 250 })
  password: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  emailVerificationToken?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updateAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
