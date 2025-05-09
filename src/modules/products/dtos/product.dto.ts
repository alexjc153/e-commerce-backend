import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  readonly price: number;

  @IsNumber()
  @IsNotEmpty()
  readonly stock: number;

  @IsString()
  @IsOptional()
  readonly images: string[];

  @IsString()
  @IsNotEmpty()
  readonly slug: string;

  @IsUUID()
  @IsNotEmpty()
  readonly categoryId: string;
}
