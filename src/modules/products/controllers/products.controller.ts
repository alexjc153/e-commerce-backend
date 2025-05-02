import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dtos/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsServices: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  getAll() {
    return this.productsServices.findAll();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get product by uuid' })
  getOne() {
    return this.productsServices.findOne('uuid');
  }

  @Post()
  @ApiOperation({ summary: 'Create product' })
  create(@Body() payload: CreateProductDto) {
    return this.productsServices.create(payload);
  }
}
