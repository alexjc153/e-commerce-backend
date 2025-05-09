import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from '@products/dtos/category.dto';
import { Category } from '@products/entities/categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger('CategoriesService');

  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async findAll() {
    try {
      return await this.categoriesRepository.find();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(uuid: string) {
    try {
      return await this.categoriesRepository.findOne({ where: { uuid } });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(payload: CreateCategoryDto) {
    try {
      const product = this.categoriesRepository.create(payload);
      await this.categoriesRepository.save(product);
      return product;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    // console.log(error)
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }

  async deleteAllCategories() {
    const query = this.categoriesRepository.createQueryBuilder('product');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}
