import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Role } from '../../shared/enums/role.enum';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user (pass X-Admin-Secret header to register as admin)' })
  @ApiHeader({
    name: 'x-admin-secret',
    description: 'Secret key to register with admin role. Omit to register as regular user.',
    required: false,
  })
  @ApiResponse({ status: 201, description: 'Registered successfully, returns JWT and user info' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  register(
    @Body() registerDto: RegisterDto,
    @Headers('x-admin-secret') adminSecret?: string,
  ) {
    const secret = this.configService.get<string>('adminSecret');
    const role = secret && adminSecret === secret ? Role.ADMIN : Role.USER;
    return this.authService.register(registerDto, role);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and receive a JWT access token' })
  @ApiResponse({ status: 200, description: 'Login successful, returns JWT and user info' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
