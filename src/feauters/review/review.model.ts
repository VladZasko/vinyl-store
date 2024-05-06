import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewDBType, ReviewSchema } from '../../db/schemes/review.schemes';
import { ReviewService } from './domain/review.service';
import { ReviewController } from './review.controller';
import { ReviewRepository } from './repository/review.repository';
import {
  RefreshTokenMetaDBType,
  RefreshTokenMetaSchema,
} from '../../db/schemes/token.schemes';
import { AuthRepository } from '../auth/repository/auth.repository';
import { RoleGuard } from '../auth/guard/role.guard';
import { UserDBType, UserSchema } from '../../db/schemes/user.schemes';
import { SystemLogsService } from '../systenLogs/domein/system.logs.service';
import { SystemLogsRepository } from '../systenLogs/repository/system.logs.remository';
import {
  SystemLogsDBType,
  SystemLogsSchema,
} from '../../db/schemes/system.logs.schemes';

@Module({
  imports: [
    MongooseModule.forFeature([
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
    ]),
  ],
  providers: [
    ReviewService,
    ReviewRepository,
    AuthRepository,
    RoleGuard,
    SystemLogsService,
    SystemLogsRepository,
  ],
  controllers: [ReviewController],
})
export class ReviewModule {}
