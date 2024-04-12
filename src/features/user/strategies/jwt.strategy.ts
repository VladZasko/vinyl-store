import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from '../repository/user.repository';
import { UserViewModel } from '../models/output/UserViewModel';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<{ userId: string }> {
    const user: UserViewModel = await this.usersRepository.getUserById(
      payload.sub,
    );
    if (!user) {
      throw new UnauthorizedException('not authorized');
    }
    return { userId: payload.sub };
  }
}