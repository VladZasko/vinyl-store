import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { AuthModule } from '../feauters/auth/auth.module';
import { CreateAdmin } from './command/create.admin';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDBType, UserSchema } from '../db/schemes/user.schemes';
import {
  RefreshTokenMetaDBType,
  RefreshTokenMetaSchema,
} from '../db/schemes/token.schemes';
import {
  SystemLogsDBType,
  SystemLogsSchema,
} from '../db/schemes/system.logs.schemes';
import { AuthService } from '../feauters/auth/domain/auth.service';
import { AuthRepository } from '../feauters/auth/repository/auth.repository';
import { JwtStrategy } from '../feauters/auth/strategie/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from '../feauters/auth/strategie/local.strategy';
import { EmailAdapter } from '../adapter/email-adapter';
import { SeedVinyl } from './command/seed.vinyl';
import { VinylDBType, VinylSchema } from '../db/schemes/vinyl.shemes';

@Module({
  imports: [
    CommandModule,
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
      {
        name: VinylDBType.name,
        schema: VinylSchema,
      },
    ]),
  ],
  providers: [
    CreateAdmin,
    SeedVinyl,
    AuthService,
    AuthRepository,
    JwtStrategy,
    JwtService,
    LocalStrategy,
    EmailAdapter,
  ],
  exports: [CreateAdmin, SeedVinyl],
})
export class SeedsModule {}
