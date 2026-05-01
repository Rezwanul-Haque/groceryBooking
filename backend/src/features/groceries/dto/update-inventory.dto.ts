import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateInventoryDto {
  @ApiProperty({ example: 50, description: 'New inventory count (0 marks item as unavailable)' })
  @IsNumber()
  @Min(0)
  inventory: number;
}
