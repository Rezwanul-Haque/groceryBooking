import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(_createUserDto: CreateUserDto): Promise<User> {
    // TODO: implement
    return null;
  }

  async findByEmail(_email: string): Promise<User | null> {
    // TODO: implement
    return null;
  }

  async findById(_id: number): Promise<User | null> {
    // TODO: implement
    return null;
  }
}
