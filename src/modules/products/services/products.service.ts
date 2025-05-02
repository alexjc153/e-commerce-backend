import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/products.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dtos/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async findAll() {
    try {
      return await this.productsRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(uuid: string) {
    try {
      return await this.productsRepository.findOne({ where: { uuid } });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(payload: CreateProductDto) {
    try {
      const product = this.productsRepository.create(payload);
      await this.productsRepository.save(product);
      return product;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
