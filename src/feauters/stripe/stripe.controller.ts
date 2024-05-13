import {
  BadRequestException,
  RawBodyRequest,
  Controller,
  Get,
  Post,
  Req,
} from '@nestjs/common';
import Stripe from 'stripe';
import { VinylService } from '../vinyl/domain/vinyl.service';
import { ConfigService } from '@nestjs/config';

@Controller('stripe')
export class StripeController {
  constructor(
    protected vinylService: VinylService,
    private configService: ConfigService,
  ) {}

  @Get('success')
  async success() {
    return 'Great. You bought the best product. Check you products page';
  }
  @Get('error')
  async error() {
    return 'Something wrong. Check you products page';
  }

  @Post('webhook')
  async webhook(@Req() req: RawBodyRequest<Request>) {
    const stripe = new Stripe(this.configService.get('stripe.STRIPE_API_KEY'), {
      apiVersion: '2024-04-10',
    });
    const signature = req.headers['stripe-signature'];
    try {
      const event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        this.configService.get('stripe.STRIPE_SECRET'),
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        await this.vinylService.finishBuyVinyl(session.client_reference_id);
      }
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }
}
