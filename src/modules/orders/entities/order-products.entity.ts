import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '@products/entities/products.entity';

@Entity({ name: 'order_products' })
export class OrderProducts {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => Order, (order) => order.products)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;
}
