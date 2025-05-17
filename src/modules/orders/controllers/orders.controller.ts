import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all orders by user' })
  getByUser(@Param('userId') userId: string) {
    return this.ordersService.findByUser(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  create(@Body() payload: CreateOrderDto) {
    return this.ordersService.create(payload);
  }
}
