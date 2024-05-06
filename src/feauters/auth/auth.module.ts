import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategie/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategie/local.strategy';
import { AuthService } from './domain/auth.service';
import { AuthRepository } from './repository/auth.repository';
import { EmailAdapter } from '../../adapter/email-adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDBType, UserSchema } from '../../db/schemes/user.schemes';
import {
  RefreshTokenMetaDBType,
  RefreshTokenMetaSchema,
} from '../../db/schemes/token.schemes';
import { CqrsModule } from '@nestjs/cqrs';
import { RefreshTokenGuard } from './guard/refresh-token.guard';
import { IsValidDateConstraint } from '../../utils/customDecorators/date.decorator';
import { GoogleStrategy } from './strategie/google.strategy';
import { SystemLogsService } from '../systenLogs/domein/system.logs.service';
import {
  SystemLogsDBType,
  SystemLogsSchema,
} from '../../db/schemes/system.logs.schemes';
import { SystemLogsRepository } from '../systenLogs/repository/system.logs.remository';

@Module({
  imports: [
    MongooseModule.forFeature([
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
    PassportModule,
    CqrsModule,
  ],
  providers: [
    AuthService,
    AuthRepository,
    JwtStrategy,
    JwtService,
    LocalStrategy,
    EmailAdapter,
    RefreshTokenGuard,
    IsValidDateConstraint,
    GoogleStrategy,
    SystemLogsService,
    SystemLogsRepository,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
