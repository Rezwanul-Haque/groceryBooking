import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(_registerDto: RegisterDto) {
    // TODO: hash password, create user, return token
  }

  async login(_loginDto: LoginDto) {
    // TODO: validate credentials, return JWT token
  }
}
