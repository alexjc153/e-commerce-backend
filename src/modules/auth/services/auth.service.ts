import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/services/users.service';

import * as bcrypt from 'bcrypt';
import { User } from '@users/entities/user.entity';
import { PayloadToken } from '@auth/interfaces/token.interface';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from '@auth/interfaces/register-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.findUser({
        email,
      });

      if (!user) {
        throw new HttpException('Usuario no registrado', HttpStatus.NOT_FOUND);
      }

      if (!(await bcrypt.compare(password, user.password))) {
        throw new HttpException(
          'Credenciales inválidas',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return user;
    } catch (error) {
      this.logger.error(`Error validating user ${email}: ${error.message}`);
      throw error;
    }
  }

  generateJWT(user: User) {
    const payload: PayloadToken = { sub: user.uuid };
    return {
      access_token: this.signJWT(payload, '1d'),
      user,
    };
  }

  public signJWT(payload: any, expires: number | string) {
    return this.jwtService.sign(payload, { expiresIn: expires });
  }

  async register(payload: RegisterUserDto) {
    const emailExists = await this.usersRepo.existsBy({
      email: payload.email,
    });
    if (emailExists) {
      throw new ConflictException('El correo ya está registrado');
    }

    const verificationToken = this.jwtService.sign(
      { email: payload.email },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      },
    );

    const user = await this.usersRepo.save({
      ...payload,
      password: await bcrypt.hash(payload.password, 12),
      emailVerificationToken: verificationToken,
    });
    // await this.mailService.sendUserConfirmation(user, verificationToken);
    return user;
  }

  async getUserByToken(token: string) {
    const decoded = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    const user = await this.usersService.findUser({
      email: decoded.email,
    });
    return user;
  }
}
