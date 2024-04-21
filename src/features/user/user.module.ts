import { UserService } from './domain/user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailAdapter } from './adapter/email-adapter';
import { Post } from '../../db/entity/post.entity';
import { Like } from '../../db/entity/like.entity';
import { User } from '../../db/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Like, User])],
  providers: [UserService, UserRepository, EmailAdapter],
  controllers: [UserController],
})
export class UsersModule {}
