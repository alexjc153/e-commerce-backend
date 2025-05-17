import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateOrderProductDto } from './order-product.dto';

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  readonly total: number;

  @IsUUID()
  @IsNotEmpty()
  readonly userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductDto)
  products: CreateOrderProductDto[];
}
