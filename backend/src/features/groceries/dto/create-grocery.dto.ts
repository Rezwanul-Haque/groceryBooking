import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateGroceryDto {
  @ApiProperty({ example: 'Organic Apples' })
  @IsString()
  name: string;

  @ApiProperty({ example: 4.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 'Fresh organic apples from local farms' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  inventory: number;
}
