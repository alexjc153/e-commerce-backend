import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ProductsModule } from '@products/products.module';
import { UsersModule } from '@users/users.module';
import { SeedController } from './seed.controller';

@Module({
  imports: [ProductsModule, UsersModule],
  providers: [SeedService],
  controllers: [SeedController],
})
export class SeedModule {}
