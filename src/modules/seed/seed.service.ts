import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from '@products/services/products.service';
import { User } from '@users/entities/user.entity';
import { Repository } from 'typeorm';
import { initialData } from './seed-data';
import { Category } from '@products/entities/categories.entity';
import { CategoriesService } from '@products/services/categories.service';
import { CreateProductDto } from '@products/dtos/product.dto';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    await this.insertUsers();
    const insertedCategories = await this.insertCategories();
    const categoryIds = insertedCategories.map(
      (category: Category) => category.uuid,
    );
    await this.insertProductsWithRandomCategory(categoryIds);
    return 'SEED EXECUTED';
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();
    await this.categoriesService.deleteAllCategories();
    const queryBuilder = this.usersRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach((user) => {
      users.push(this.usersRepository.create(user));
    });

    const dbUsers = await this.usersRepository.save(seedUsers);

    return dbUsers[0];
  }

  private async insertCategories() {
    await this.categoriesService.deleteAllCategories();
    const categories = initialData.categories;
    const insertPromises = [];
    categories.forEach((category) => {
      insertPromises.push(this.categoriesService.create(category));
    });

    return await Promise.all(insertPromises);
  }

  private async insertProductsWithRandomCategory(categoryIds: string[]) {
    await this.productsService.deleteAllProducts();
    const products = initialData.products;

    const insertPromises = [];

    products.forEach((product) => {
      const randomCategoryId =
        categoryIds[Math.floor(Math.random() * categoryIds.length)];
      const slug = this.productsService.generateSlug(product.name);
      const productWithCategory: CreateProductDto = {
        ...product,
        slug,
        categoryId: randomCategoryId,
      };

      return this.productsService.create(productWithCategory);
    });

    await Promise.all(insertPromises);

    return true;
  }
}
