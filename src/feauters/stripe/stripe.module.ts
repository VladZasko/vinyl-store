import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeAdapter } from './stripe.adapter';
import { VinylService } from '../vinyl/domain/vinyl.service';
import { VinylRepository } from '../vinyl/repository/vinyl.repository';
import { UserRepository } from '../user/repository/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { VinylDBType, VinylSchema } from '../../db/schemes/vinyl.shemes';
import { ReviewDBType, ReviewSchema } from '../../db/schemes/review.schemes';
import { UserDBType, UserSchema } from '../../db/schemes/user.schemes';
import {
  RefreshTokenMetaDBType,
  RefreshTokenMetaSchema,
} from '../../db/schemes/token.schemes';
import {
  SystemLogsDBType,
  SystemLogsSchema,
} from '../../db/schemes/system.logs.schemes';
import { OrderDBType, OrderSchema } from '../../db/schemes/order.schemes';
import { EmailAdapter } from '../../adapter/email-adapter';
import { TelegramAdapter } from '../../adapter/telegram.adapter';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: VinylDBType.name,
        schema: VinylSchema,
      },
      {
        name: ReviewDBType.name,
        schema: ReviewSchema,
      },
      {
        name: UserDBType.name,
        schema: UserSchema,
      },
      {
        name: RefreshTokenMetaDBType.name,
        schema: RefreshTokenMetaSchema,
      },
      {
        name: SystemLogsDBType.name,
        schema: SystemLogsSchema,
      },
      {
        name: OrderDBType.name,
        schema: OrderSchema,
      },
    ]),
  ],
  providers: [
    StripeAdapter,
    VinylService,
    VinylRepository,
    UserRepository,
    EmailAdapter,
    TelegramAdapter,
  ],
  controllers: [StripeController],
})
export class StripeModule {}
