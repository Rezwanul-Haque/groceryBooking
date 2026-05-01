import { PartialType } from '@nestjs/swagger';
import { CreateGroceryDto } from './create-grocery.dto';

export class UpdateGroceryDto extends PartialType(CreateGroceryDto) {}
