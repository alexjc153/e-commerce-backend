import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateOrderDto } from '@orders/dtos/order.dto';
import { OrdersService } from '@orders/services/orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  getAll() {
    return this.ordersService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  create(@Body() payload: CreateOrderDto) {
    return this.ordersService.create(payload);
  }
}
