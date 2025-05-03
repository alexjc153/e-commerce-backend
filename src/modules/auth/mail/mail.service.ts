import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Confirma tu correo electrónico',
      context: {
        name: user.email,
        url,
      },
    });
  }
}
