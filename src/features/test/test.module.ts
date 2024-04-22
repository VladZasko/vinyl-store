import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { TestSqlRepository } from './test.sql.repository';
import { TestController } from './test.controller';
import { TestMongoDbQueryRepository } from './test.mongoDb.repository';

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
  providers: [TestSqlRepository, TestMongoDbQueryRepository],
  controllers: [TestController],
})
export class TestModule {}
