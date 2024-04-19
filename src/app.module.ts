import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { UsersModule } from './features/user/user.module';
import { PostModule } from './features/post/post.module';
import { AuthModule } from './features/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, PostModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
