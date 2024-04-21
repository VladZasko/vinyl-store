import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserSqlRepository } from '../../user/repository/user.sql.repository';
import { User } from '../../../db/entity/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected usersRepository: UserSqlRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<{ userId: string }> {
    const user: User = await this.usersRepository.getUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('not authorized');
    }
    return { userId: payload.sub };
  }
}
