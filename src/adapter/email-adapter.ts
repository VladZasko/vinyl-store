import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailAdapterDto } from '../feauters/auth/model/input/EmailAdapterDto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailAdapter {
  constructor(private configService: ConfigService) {}
  async sendCode(newUser: EmailAdapterDto): Promise<boolean> {
    const transport = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get('google.GOOGLE_MAIL_USER'),
        pass: this.configService.get('google.GOOGLE_MAIL_PASS'),
      },
    });
    await transport.sendMail({
      from: 'Vlad Zasko <uladzislauzasko@gmail.com>',
      to: newUser.email,
      subject: 'Confirmation Code',
      html:
        ' <h1>Thanks for your registration</h1>\n' +
        ' <p>To finish registration please follow the link below:\n' +
        `${newUser.confirmationCode}` +
        `     <a href=\'https://somesite.com/confirm-email?code=${newUser.confirmationCode}\'>complete registration</a>` +
        ' </p>',
    });

    return true;
  }
  async sendNewCode(user: EmailAdapterDto): Promise<boolean> {
    const transport = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get('google.GOOGLE_MAIL_USER'),
        pass: this.configService.get('google.GOOGLE_MAIL_PASS'),
      },
    });
    await transport.sendMail({
      from: 'Vlad Zasko <uladzislauzasko@gmail.com>',
      to: user.email,
      subject: 'Confirmation Code',
      html:
        ' <h1>new code</h1>\n' +
        ' <p>new code:\n' +
        `${user.newCode}` +
        `     <a href=\'https://somesite.com/confirm-email?code=${user.newCode}\'>complete registration</a>\n` +
        ' </p>',
    });
    return true;
  }

  async sendNotificationByVinyl(user: any): Promise<boolean> {
    const transport = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get('google.GOOGLE_MAIL_USER'),
        pass: this.configService.get('google.GOOGLE_MAIL_PASS'),
      },
    });
    await transport.sendMail({
      from: 'Vlad Zasko <uladzislauzasko@gmail.com>',
      to: user.email,
      subject: 'Notification Buy Vinyl',
      html: ' <h1>Buy Vinyl</h1>\n' + ' <p> Thank you for your purchase! </p>', // html body
    });
    return true;
  }
}
