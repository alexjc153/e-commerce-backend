import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '@users/dtos/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.ACCEPTED)
  getAll() {
    return this.usersService.findUsers();
  }

  @Post()
  create(@Body() payload: CreateUserDto) {
    return this.usersService.create(payload);
  }

  @Post('email-availability')
  async checkEmailAvailability(@Body('email') email: string) {
    const exists = await this.usersService.findUser({ email });
    return { available: !exists };
  }
}
