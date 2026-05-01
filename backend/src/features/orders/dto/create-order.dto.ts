import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNumber, Min, ValidateNested } from 'class-validator';

export class OrderItemDto {
  @IsNumber()
  groceryId: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
