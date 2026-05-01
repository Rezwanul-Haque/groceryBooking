import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grocery } from './entities/grocery.entity';
import { CreateGroceryDto } from './dto/create-grocery.dto';
import { UpdateGroceryDto } from './dto/update-grocery.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class GroceriesService {
  constructor(
    @InjectRepository(Grocery)
    private readonly groceryRepository: Repository<Grocery>,
  ) {}

  async findAll(): Promise<Grocery[]> {
    // TODO: implement
    return [];
  }

  async findOne(_id: number): Promise<Grocery | null> {
    // TODO: implement
    return null;
  }

  async create(_createGroceryDto: CreateGroceryDto): Promise<Grocery> {
    // TODO: implement
    return null;
  }

  async update(_id: number, _updateGroceryDto: UpdateGroceryDto): Promise<Grocery> {
    // TODO: implement
    return null;
  }

  async remove(_id: number): Promise<void> {
    // TODO: implement
  }

  async updateInventory(_id: number, _updateInventoryDto: UpdateInventoryDto): Promise<Grocery> {
    // TODO: implement
    return null;
  }
}
