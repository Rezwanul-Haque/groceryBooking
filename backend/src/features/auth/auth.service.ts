import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from '../../shared/interfaces/jwt-payload.interface';
import { Role } from '../../shared/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto, role: Role = Role.USER) {
    const user = await this.usersService.create({ ...registerDto, role });
    const token = this.signToken({ sub: user.id, email: user.email, role: user.role });
    return { accessToken: token, user: this.sanitize(user) };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(loginDto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.signToken({ sub: user.id, email: user.email, role: user.role });
    return { accessToken: token, user: this.sanitize(user) };
  }

  private signToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  private sanitize(user: any) {
    const { password: _pw, ...safe } = user;
    return safe;
  }
}
