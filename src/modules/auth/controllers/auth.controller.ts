import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { User } from '@users/entities/user.entity';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RegisterUserDto } from '@auth/interfaces/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    const user = req.user as User;
    return this.authService.generateJWT(user);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() payload: RegisterUserDto) {
    return this.authService.register(payload);
  }
}
