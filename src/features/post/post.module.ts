import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './domain/post.service';
import { PostSqlRepository } from './repository/post.sql.repository';
import { UserSqlRepository } from '../user/repository/user.sql.repository';
import { Post } from '../../db/sql/entity/post.entity';
import { Like } from '../../db/sql/entity/like.entity';
import { User } from '../../db/sql/entity/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserMongoType,
  UserSchema,
} from '../../db/mongoDb/schemes/user.schemes';
import {
  PostMongoType,
  PostSchema,
} from '../../db/mongoDb/schemes/post.schemes';
import {
  LikeMongoType,
  LikeSchema,
} from '../../db/mongoDb/schemes/like.schemes';
import { PostMongoDbRepository } from './repository/post.mongoDb.repository';
import { PostMongoDbQueryRepository } from './repository/post.mongoDb.query.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Like, User]),
    MongooseModule.forFeature([
      {
        name: UserMongoType.name,
        schema: UserSchema,
      },
      {
        name: PostMongoType.name,
        schema: PostSchema,
      },
      {
        name: LikeMongoType.name,
        schema: LikeSchema,
      },
    ]),
  ],
  providers: [
    PostService,
    PostSqlRepository,
    UserSqlRepository,
    PostMongoDbRepository,
    PostMongoDbQueryRepository,
  ],
  controllers: [PostController],
})
export class PostModule {}
