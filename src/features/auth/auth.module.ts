import { Module } from '@nestjs/common';
import { AuthService } from './domain/auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from '../user/repository/user.repository';
import { JwtStrategy } from './strategie/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategie/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), JwtModule, PassportModule],
  providers: [
    AuthService,
    UserRepository,
    JwtStrategy,
    JwtService,
    LocalStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
