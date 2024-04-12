import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './features/user/strategies/local.strategy';
import { JwtStrategy } from './features/user/strategies/jwt.strategy';
import { EmailAdapter } from './features/user/adapters/email-adapter';
import { UserController } from './features/user/users.controller';
import { UsersRepository } from './features/user/repository/user.repository';
import { UsersService } from './features/user/domain/users.servis';
import { PostsController } from './features/post/posts.controller';
import { PostsService } from './features/post/domain/posts.servis';
import { PostsRepository } from './features/post/repository/posts.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AppController, UserController, PostsController],
  providers: [
    AppService,
    LocalStrategy,
    JwtStrategy,
    EmailAdapter,
    UsersRepository,
    UsersService,
    PostsService,
    PostsRepository,
  ],
})
export class AppModule {}
