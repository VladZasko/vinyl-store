import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../domain/users.servis';
import { LoginAuthUserModel } from '../models/input/LoginAuthUserModel';
import { UserViewModel } from '../models/output/UserViewModel';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const loginData: LoginAuthUserModel = {
      email: email,
      password: password,
    };
    const user: UserViewModel =
      await this.usersService.checkCredentials(loginData);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
