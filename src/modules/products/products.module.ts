import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/products.entity';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { Category } from './entities/categories.entity';
import { CategoriesService } from './services/categories.service';
import { CategoriesController } from './controllers/categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  controllers: [ProductsController, CategoriesController],
  providers: [ProductsService, CategoriesService],
  exports: [TypeOrmModule, ProductsService, CategoriesService],
})
export class ProductsModule {}
