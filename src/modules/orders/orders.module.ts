import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderProducts } from './entities/order-products.entity';
import { ProductsModule } from '@products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderProducts]), ProductsModule],
})
export class OrdersModule {}
