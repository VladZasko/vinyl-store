import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { AuthRepository } from '../repository/auth.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    protected authRepository: AuthRepository,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get('google.GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('google.GOOGLE_CLIENT_SECRET'),
      callbackURL: `${configService.get('serveo.SERVEO_URL')}/auth/google/callback`,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    const user = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
    };

    done(null, user);
  }
}
