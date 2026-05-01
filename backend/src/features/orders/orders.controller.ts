import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@ApiTags('Orders')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Place a new order with one or more grocery items' })
  @ApiResponse({ status: 201, description: 'Order placed successfully' })
  @ApiResponse({ status: 400, description: 'Insufficient stock for one or more items' })
  @ApiResponse({ status: 404, description: 'One or more grocery items not found' })
  create(@CurrentUser() user: any, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(user.id, createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: "List the current user's orders" })
  @ApiResponse({ status: 200, description: 'Returns all orders with items and grocery details' })
  findAll(@CurrentUser() user: any) {
    return this.ordersService.findByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: "Get a specific order by ID (must belong to current user)" })
  @ApiResponse({ status: 200, description: 'Returns the order with items and grocery details' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id, user.id);
  }
}
