import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Grocery } from '../groceries/entities/grocery.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderRepository.manager.transaction(async (manager) => {
      let totalAmount = 0;
      const items: Partial<OrderItem>[] = [];

      for (const { groceryId, quantity } of createOrderDto.items) {
        const grocery = await manager.findOne(Grocery, { where: { id: groceryId } });
        if (!grocery) throw new NotFoundException(`Grocery #${groceryId} not found`);

        if (grocery.inventory < quantity) {
          throw new BadRequestException(
            `Insufficient stock for "${grocery.name}" (requested: ${quantity}, available: ${grocery.inventory})`,
          );
        }

        grocery.inventory -= quantity;
        grocery.isAvailable = grocery.inventory > 0;
        await manager.save(grocery);

        totalAmount += Number(grocery.price) * quantity;
        items.push({ groceryId, quantity, unitPrice: Number(grocery.price) });
      }

      const order = manager.create(Order, {
        userId,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        items: items as OrderItem[],
      });

      return manager.save(Order, order);
    });
  }

  findByUser(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items', 'items.grocery'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id, userId },
      relations: ['items', 'items.grocery'],
    });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }
}
