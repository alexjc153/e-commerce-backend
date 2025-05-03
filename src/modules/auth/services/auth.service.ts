import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/modules/users/services/users.service';

import * as bcrypt from 'bcrypt';
import { User } from '@users/entities/user.entity';
import { PayloadToken } from '@auth/interfaces/token.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new HttpException('Usuario no registrado', HttpStatus.NOT_FOUND);
      }

      if (!(await bcrypt.compare(password, user.password))) {
        throw new HttpException(
          'Credenciales inválidas',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // if (!user.userVerified) {
      //   throw new HttpException('Usuario no verificado', HttpStatus.FORBIDDEN);
      // }

      // if (user.userBlocked) {
      //   throw new HttpException('Usuario bloqueado', HttpStatus.FORBIDDEN);
      // }

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
}
