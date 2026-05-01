import { Injectable, NotFoundException } from '@nestjs/common';
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

  findAll(): Promise<Grocery[]> {
    return this.groceryRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Grocery> {
    const grocery = await this.groceryRepository.findOne({ where: { id } });
    if (!grocery) throw new NotFoundException(`Grocery #${id} not found`);
    return grocery;
  }

  create(createGroceryDto: CreateGroceryDto): Promise<Grocery> {
    const grocery = this.groceryRepository.create({
      ...createGroceryDto,
      isAvailable: createGroceryDto.inventory > 0,
    });
    return this.groceryRepository.save(grocery);
  }

  async update(id: number, updateGroceryDto: UpdateGroceryDto): Promise<Grocery> {
    const grocery = await this.findOne(id);
    Object.assign(grocery, updateGroceryDto);
    if (updateGroceryDto.inventory !== undefined) {
      grocery.isAvailable = updateGroceryDto.inventory > 0;
    }
    return this.groceryRepository.save(grocery);
  }

  async remove(id: number): Promise<void> {
    const grocery = await this.findOne(id);
    await this.groceryRepository.remove(grocery);
  }

  async updateInventory(id: number, dto: UpdateInventoryDto): Promise<Grocery> {
    const grocery = await this.findOne(id);
    grocery.inventory = dto.inventory;
    grocery.isAvailable = dto.inventory > 0;
    return this.groceryRepository.save(grocery);
  }
}
