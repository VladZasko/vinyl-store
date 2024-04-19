import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoginAuthUserModel } from '../model/LoginAuthUserModel';
import { UserViewModel } from '../../user/models/output/UserViewModel';
import { AuthService } from '../domain/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
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
      await this.authService.checkCredentials(loginData);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
