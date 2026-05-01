import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateGroceryDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  inventory: number;
}
