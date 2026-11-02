import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      statusCode: 200,
      message: 'Login berhasil! Selamat datang di CelenganKu.',
      data: result,
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return {
      statusCode: 201,
      message: 'Pendaftaran akun berhasil!',
      data: result,
    };
  }

  @Get('me')
  async getProfile(@Headers('x-user-id') userId?: string) {
    const resolvedId = userId || process.env.DEFAULT_USER_ID || 'user_id_123';
    const profile = await this.authService.getProfile(resolvedId);
    return {
      statusCode: 200,
      data: profile,
    };
  }

  @Get('users')
  async getAllUsers() {
    const users = await this.authService.getAllUsers();
    return {
      statusCode: 200,
      data: users,
    };
  }
}

