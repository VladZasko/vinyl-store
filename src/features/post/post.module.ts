import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './domain/post.service';
import { PostRepository } from './repository/post.repository';
import { UserRepository } from '../user/repository/user.repository';

@Module({
  imports: [],
  providers: [PostService, PostRepository, UserRepository],
  controllers: [PostController],
})
export class PostModule {}
