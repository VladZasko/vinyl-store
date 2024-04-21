import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './domain/post.service';
import { PostRepository } from './repository/post.repository';
import { UserRepository } from '../user/repository/user.repository';
import { Post } from '../../db/entity/post.entity';
import { Like } from '../../db/entity/like.entity';
import { User } from '../../db/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Like, User])],
  providers: [PostService, PostRepository, UserRepository],
  controllers: [PostController],
})
export class PostModule {}
