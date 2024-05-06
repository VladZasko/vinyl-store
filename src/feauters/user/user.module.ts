import { config } from 'dotenv';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategie/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategie/local.strategy';
import { AuthService } from './domain/auth.service';
import { AuthQueryRepository } from './repository/auth.query.repository';
import { AuthRepository } from './repository/auth.repository';
import { EmailAdapter } from './adapter/email-adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDBType, UserSchema } from '../../db/schemes/user.schemes';
import {
  RefreshTokenMetaDBType,
  RefreshTokenMetaSchema,
} from '../../db/schemes/token.schemes';
import { CqrsModule } from '@nestjs/cqrs';
import { RefreshTokenGuard } from './guard/refresh-token.guard';

config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    MongooseModule.forFeature([
      {
        name: UserDBType.name,
        schema: UserSchema,
      },
      {
        name: RefreshTokenMetaDBType.name,
        schema: RefreshTokenMetaSchema,
      },
    ]),
    PassportModule,
    CqrsModule,
  ],
  providers: [
    AuthService,
    AuthRepository,
    AuthQueryRepository,
    JwtStrategy,
    JwtService,
    LocalStrategy,
    EmailAdapter,
    RefreshTokenGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
