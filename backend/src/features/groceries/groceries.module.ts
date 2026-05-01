import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroceriesController } from './groceries.controller';
import { GroceriesService } from './groceries.service';
import { Grocery } from './entities/grocery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grocery])],
  controllers: [GroceriesController],
  providers: [GroceriesService],
  exports: [GroceriesService],
})
export class GroceriesModule {}
