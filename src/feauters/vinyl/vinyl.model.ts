import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VinylController } from './vinyl.controller';
import { VinylQueryRepository } from './repository/vinyl.query.repository';
import { VinylRepository } from './repository/vinyl.repository';
import { VinylService } from './domain/vinyl.service';
import { VinylDBType, VinylSchema } from '../../db/schemes/vinyl.shemes';
import { UserQueryRepository } from '../user/repository/user.query.repository';
import { ReviewDBType, ReviewSchema } from '../../db/schemes/review.schemes';
import { UserDBType, UserSchema } from '../../db/schemes/user.schemes';
import { UserRepository } from '../user/repository/user.repository';
import { RoleGuard } from '../auth/guard/role.guard';
import { AuthRepository } from '../auth/repository/auth.repository';
import {
  RefreshTokenMetaDBType,
  RefreshTokenMetaSchema,
} from '../../db/schemes/token.schemes';
import {
  SystemLogsDBType,
  SystemLogsSchema,
} from '../../db/schemes/system.logs.schemes';
import { SystemLogsService } from '../systenLogs/domein/system.logs.service';
import { SystemLogsRepository } from '../systenLogs/repository/system.logs.remository';
import { StripeAdapter } from '../stripe/stripe.adapter';
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
    VinylService,
    VinylRepository,
    VinylQueryRepository,
    UserQueryRepository,
    UserRepository,
    AuthRepository,
    RoleGuard,
    SystemLogsService,
    SystemLogsRepository,
    StripeAdapter,
    EmailAdapter,
    TelegramAdapter,
  ],
  controllers: [VinylController],
})
export class VinylModule {}
