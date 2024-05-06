import Stripe from 'stripe';
import { BuyVinylDto } from '../vinyl/model/dto/BuyVinylDto';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeAdapter {
  constructor(private configService: ConfigService) {}

  async buy(body: BuyVinylDto) {
    const stripe = new Stripe(this.configService.get('stripe.STRIPE_API_KEY'), {
      apiVersion: '2024-04-10',
    });
    const session = await stripe.checkout.sessions.create({
      success_url: `${this.configService.get('serveo.SERVEO_URL')}/stripe/success`,
      cancel_url: `${this.configService.get('serveo.SERVEO_URL')}/stripe/error`,
      line_items: [
        {
          price_data: {
            product_data: {
              name: 'Your product: ' + body.title,
            },
            unit_amount: 100 * body.price,
            currency: 'USD',
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      client_reference_id: body.client_reference_id,
    });

    return { url: session.url };
  }
}
