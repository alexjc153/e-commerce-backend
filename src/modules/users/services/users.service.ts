import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '@users/dtos/users.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findAll() {
    try {
      return await this.userRepo.find();
    } catch (error) {
      return error;
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.userRepo.findOne({ where: { email } });
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  async create(payload: CreateUserDto) {
    const emailRegistered = await this.findByEmail(payload.email);
    if (emailRegistered) {
      throw new HttpException(
        'El usuario ya se encuentra registrado.',
        HttpStatus.CONFLICT,
      );
    }
    const newUser = this.userRepo.create(payload);
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;
    return await this.userRepo.save(newUser);
  }
}
