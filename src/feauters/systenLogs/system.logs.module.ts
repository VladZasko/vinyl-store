import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SystemLogsDBType,
  SystemLogsSchema,
} from '../../db/schemes/system.logs.schemes';
import { RoleGuard } from '../auth/guard/role.guard';
import { SystemLogsController } from './system.logs.controllet';
import { SystemLogsQueryRepository } from './repository/system.logs.query.remository';
import { SystemLogsRepository } from './repository/system.logs.remository';
import { SystemLogsService } from './domein/system.logs.service';
import { AuthRepository } from '../auth/repository/auth.repository';
import { UserDBType, UserSchema } from '../../db/schemes/user.schemes';
import {
  RefreshTokenMetaDBType,
  RefreshTokenMetaSchema,
} from '../../db/schemes/token.schemes';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserDBType.name,
        schema: UserSchema,
      },
      {
        name: SystemLogsDBType.name,
        schema: SystemLogsSchema,
      },
      {
        name: RefreshTokenMetaDBType.name,
        schema: RefreshTokenMetaSchema,
      },
    ]),
  ],
  providers: [
    SystemLogsService,
    SystemLogsRepository,
    SystemLogsQueryRepository,
    AuthRepository,
    RoleGuard,
  ],
  controllers: [SystemLogsController],
  exports: [SystemLogsService, SystemLogsRepository],
})
export class SystemLogsModule {}
