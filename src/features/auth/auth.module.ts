import { Module } from '@nestjs/common';
import { AuthService } from './domain/auth.service';
import { AuthController } from './auth.controller';
import { UserSqlRepository } from '../user/repository/user.sql.repository';
import { JwtStrategy } from './strategie/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategie/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../../db/entity/post.entity';
import { Like } from '../../db/entity/like.entity';
import { User } from '../../db/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Like, User]),
    ConfigModule.forRoot(),
    JwtModule,
    PassportModule,
  ],
  providers: [
    AuthService,
    UserSqlRepository,
    JwtStrategy,
    JwtService,
    LocalStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
