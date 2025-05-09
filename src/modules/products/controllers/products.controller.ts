import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dtos/product.dto';
import { PaginationDto } from '@common/pagination.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsServices: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  getAll(@Query() paginationDto: PaginationDto) {
    return this.productsServices.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({ summary: 'Get product by uuid' })
  getOne(@Param('term') term: string) {
    return this.productsServices.findOne(term);
  }

  @Post()
  @ApiOperation({ summary: 'Create product' })
  create(@Body() payload: CreateProductDto) {
    return this.productsServices.create(payload);
  }
}
