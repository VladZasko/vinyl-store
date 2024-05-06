import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDBType, UserSchema } from '../../db/schemes/user.schemes';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repository';
import { UserQueryRepository } from './repository/user.query.repository';
import { UserService } from './domain/user.service';
import { IsValidDateConstraint } from '../../utils/customDecorators/date.decorator';
import { ReviewDBType, ReviewSchema } from '../../db/schemes/review.schemes';
import { VinylDBType, VinylSchema } from '../../db/schemes/vinyl.shemes';
import { StorageService } from '../storage/storage.service';
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
        name: UserDBType.name,
        schema: UserSchema,
      },
      {
        name: ReviewDBType.name,
        schema: ReviewSchema,
      },
      {
        name: VinylDBType.name,
        schema: VinylSchema,
      },
      {
        name: SystemLogsDBType.name,
        schema: SystemLogsSchema,
      },
    ]),
  ],
  providers: [
    UserService,
    UserRepository,
    UserQueryRepository,
    IsValidDateConstraint,
    StorageService,
    SystemLogsService,
    SystemLogsRepository,
  ],
  controllers: [UserController],
})
export class UserModule {}
