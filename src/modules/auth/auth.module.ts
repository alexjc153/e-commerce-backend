import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import config from 'src/config';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwt.secret,
        };
      },
    }),
    UsersModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
