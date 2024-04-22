import { config } from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { UsersModule } from './features/user/user.module';
import { PostModule } from './features/post/post.module';
import { AuthModule } from './features/auth/auth.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Post } from './db/sql/entity/post.entity';
import { Like } from './db/sql/entity/like.entity';
import { User } from './db/sql/entity/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMongoType, UserSchema } from './db/mongoDb/schemes/user.schemes';
import { PostMongoType, PostSchema } from './db/mongoDb/schemes/post.schemes';
import { LikeMongoType, LikeSchema } from './db/mongoDb/schemes/like.schemes';
import { TestModule } from './features/test/test.module';

config();

const dbName = 'homework-7';
export const options: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  autoLoadEntities: true,
  synchronize: false,
};
@Module({
  imports: [
    TypeOrmModule.forRoot(options),
    TypeOrmModule.forFeature([Post, Like, User]),
    ConfigModule.forRoot(),
    UsersModule,
    PostModule,
    AuthModule,
    TestModule,
    MongooseModule.forRoot(
      process.env.MONGO_URL || `mongodb://0.0.0.0:27017/${dbName}`,
    ),
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
  controllers: [],
  providers: [],
})
export class AppModule {}
