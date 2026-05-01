import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(_userId: number, _createOrderDto: CreateOrderDto): Promise<Order> {
    // TODO: validate inventory, calculate total, persist order with items
    return null;
  }

  async findByUser(_userId: number): Promise<Order[]> {
    // TODO: implement
    return [];
  }

  async findOne(_id: number, _userId: number): Promise<Order | null> {
    // TODO: implement
    return null;
  }
}
