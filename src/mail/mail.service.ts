import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPasswordMailTemplate(
    fullName: string,
    email: string,
    code: number,
  ): Promise<void> {
    await this.mailerService
      .sendMail({
        to: email,
        from: 'chantreait230@gmail.com',
        subject: 'Reset password',
        template: 'resetpassword',
        context: {
          fullName: fullName,
          code: code,
        },
      })
      .then(() => {})
      .catch(() => {});
  }
}
