import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LocalAuthUserModel } from '../model/input/LocalAuthUserModel';
import { AuthService } from '../domain/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(protected authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const checkCredentialsDto: LocalAuthUserModel = {
      email: email,
      password: password,
    };
    const user = await this.authService.checkCredentials(checkCredentialsDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
