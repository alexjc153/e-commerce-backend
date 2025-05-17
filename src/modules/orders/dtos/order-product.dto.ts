import { IsNotEmpty, IsNumber, IsPositive, IsUUID, Min } from 'class-validator';

export class CreateOrderProductDto {
  @IsUUID()
  @IsNotEmpty()
  readonly productId: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  readonly quantity: number;

  @IsNumber()
  @IsNotEmpty()
  readonly price: number;
}
