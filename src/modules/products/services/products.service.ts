import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/products.entity';
import { ILike, Repository } from 'typeorm';
import { CreateProductDto } from '../dtos/product.dto';
import { Category } from '@products/entities/categories.entity';
import { PaginationDto } from '@common/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0, category = '' } = paginationDto;

    const whereConditions = category
      ? {
          category: {
            name: ILike(`%${category}%`),
          },
        }
      : {};

    const products = await this.productsRepository.find({
      take: limit,
      skip: offset,
      relations: {
        category: true,
      },
      order: {
        name: 'ASC',
      },
      where: whereConditions,
    });

    const totalProducts = await this.productsRepository.count({
      where: whereConditions,
    });

    return {
      count: totalProducts,
      pages: Math.ceil(totalProducts / limit),
      products: products.map((product) => ({
        ...product,
        // images: product.images.map((img) => img),
      })),
    };
  }

  async findOne(term: string) {
    try {
      let product: Product;

      if (isUUID(term)) {
        product = await this.productsRepository.findOneBy({ uuid: term });
      } else {
        const queryBuilder =
          this.productsRepository.createQueryBuilder('product');
        product = await queryBuilder
          .where('LOWER(product.name) LIKE :name OR product.slug LIKE :slug', {
            name: `%${term.toLowerCase()}%`,
            slug: `%${term.toLowerCase()}%`,
          })
          .leftJoinAndSelect('product.category', 'category')
          .getOne();
      }

      if (!product) throw new NotFoundException(`Product ${term} not found`);

      return product;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(payload: CreateProductDto) {
    try {
      const category = await this.categoriesRepository.findOneBy({
        uuid: payload.categoryId,
      });

      if (!category) {
        throw new BadRequestException(
          `Category with id ${payload.categoryId} not found`,
        );
      }
      const slug = this.generateSlug(payload.name);

      const product = this.productsRepository.create({
        ...payload,
        slug,
        category,
      });
      await this.productsRepository.save(product);
      return product;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }

  async deleteAllProducts() {
    const query = this.productsRepository.createQueryBuilder('product');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  generateSlug(name: string, separator: string = '_') {
    return name
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, separator)
      .replace(/[^\w-]+/g, '')
      .replace(new RegExp(`\\${separator}+`, 'g'), separator);
  }
}
