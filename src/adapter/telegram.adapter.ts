import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { TelegramNotificationType } from '../feauters/vinyl/model/dto/TelegramNotificationDto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramAdapter {
  constructor(private configService: ConfigService) {}
  async sendMessage(telegramNotificationDto: TelegramNotificationType) {
    const token = this.configService.get('telegram.TELEGRAM_TOKEN');

    const text = ` **New release!!** 
    
**${telegramNotificationDto.title}** - ${telegramNotificationDto.description} 
[Listen now](${this.configService.get('serveo.SERVEO_URL')}/vinyl/${telegramNotificationDto.vinylId}) 

Price: ${telegramNotificationDto.price}`;

    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: this.configService.get('telegram.TELEGRAM_CHAT_ID'),
      text: text,
      parse_mode: 'Markdown',
    });
  }
}
