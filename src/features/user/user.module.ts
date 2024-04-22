import { UserService } from './domain/user.service';
import { UserController } from './user.controller';
import { UserSqlRepository } from './repository/user.sql.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailAdapter } from './adapter/email-adapter';
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
import { UserMongoDbRepository } from './repository/user.mongoDb.repository';
import { UserMongoDbQueryRepository } from './repository/user.mongoDb.query.repository';

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
    UserService,
    UserSqlRepository,
    UserMongoDbRepository,
    UserMongoDbQueryRepository,
    EmailAdapter,
  ],
  controllers: [UserController],
})
export class UsersModule {}
