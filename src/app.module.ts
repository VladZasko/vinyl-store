import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { UsersModule } from './features/user/user.module';
import { PostModule } from './features/post/post.module';
import { AuthModule } from './features/auth/auth.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Post } from './db/entity/post.entity';
import { Like } from './db/entity/like.entity';
import { User } from './db/entity/user.entity';

export const options: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'LocalHostAdmin2693',
  database: 'homework-6',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
