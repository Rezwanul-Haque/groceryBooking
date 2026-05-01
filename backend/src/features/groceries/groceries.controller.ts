import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroceriesService } from './groceries.service';
import { CreateGroceryDto } from './dto/create-grocery.dto';
import { UpdateGroceryDto } from './dto/update-grocery.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';

@ApiTags('Groceries')
@Controller('groceries')
export class GroceriesController {
  constructor(private readonly groceriesService: GroceriesService) {}

  @Get()
  @ApiOperation({ summary: 'List all grocery items' })
  @ApiResponse({ status: 200, description: 'Returns all grocery items' })
  findAll() {
    return this.groceriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a grocery item by ID' })
  @ApiResponse({ status: 200, description: 'Returns the grocery item' })
  @ApiResponse({ status: 404, description: 'Grocery not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groceriesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '[Admin] Add a new grocery item' })
  @ApiResponse({ status: 201, description: 'Grocery item created' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin only' })
  create(@Body() createGroceryDto: CreateGroceryDto) {
    return this.groceriesService.create(createGroceryDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '[Admin] Update a grocery item' })
  @ApiResponse({ status: 200, description: 'Grocery item updated' })
  @ApiResponse({ status: 404, description: 'Grocery not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateGroceryDto: UpdateGroceryDto) {
    return this.groceriesService.update(id, updateGroceryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '[Admin] Remove a grocery item' })
  @ApiResponse({ status: 200, description: 'Grocery item removed' })
  @ApiResponse({ status: 404, description: 'Grocery not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.groceriesService.remove(id);
  }

  @Patch(':id/inventory')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '[Admin] Update inventory level of a grocery item' })
  @ApiResponse({ status: 200, description: 'Inventory updated; isAvailable synced automatically' })
  @ApiResponse({ status: 404, description: 'Grocery not found' })
  updateInventory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.groceriesService.updateInventory(id, updateInventoryDto);
  }
}
