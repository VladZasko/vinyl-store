import { UserService } from './domain/user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repository';
import { Module } from '@nestjs/common';
import { EmailAdapter } from './adapter/email-adapter';

@Module({
  imports: [],
  providers: [UserService, UserRepository, EmailAdapter],
  controllers: [UserController],
})
export class UsersModule {}
