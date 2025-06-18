import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '@users/dtos/users.dto';

import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from '@auth/interfaces/register-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  // async findAll() {
  //   try {
  //     return await this.userRepo.find();
  //   } catch (error) {
  //     return error;
  //   }
  // }

  async getUserById(id: string) {
    const user = await this.findUser({ uuid: id });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  // Método único para buscar usuario (reutilizable)
  async findUsers(where?: FindOptionsWhere<User>, select?: (keyof User)[]) {
    try {
      return await this.userRepo.find({ where, select });
    } catch (error) {
      this.logger.error(
        `Error al encontrar usuario: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error al recuperar usuario');
    }
  }

  // Mantenemos el findUser para casos individuales
  async findUser(where: FindOptionsWhere<User>, select?: (keyof User)[]) {
    return this.findUsers(where, select).then((users) => users[0]);
  }

  async create(payload: CreateUserDto | RegisterUserDto) {
    if (await this.userRepo.existsBy({ email: payload.email })) {
      this.logger.warn(
        `Intento de registro con email existente: ${payload.email}`,
      );
      throw new ConflictException('El usuario ya se encuentra registrado');
    }

    const user = this.userRepo.create({
      ...payload,
      password: await bcrypt.hash(payload.password, 10),
    });

    try {
      return await this.userRepo.save(user);
    } catch (error) {
      this.logger.error(`Error al crear usuario: ${error.message}`);
      throw new InternalServerErrorException('No se pudo crear usuario');
    }
  }
}
