import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';
import {
  RefreshTokenMetaDBType,
  RefreshTokenMetaDocument,
} from '../../../db/schemes/token.schemes';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(RefreshTokenMetaDBType.name)
    private refreshTokenMetaModel: Model<RefreshTokenMetaDocument>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const accessToken = await this.refreshTokenMetaModel.findOne({
      userId: payload.userId,
    });

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    if (accessToken.issuedAt !== payload.issuedAt) {
      throw new UnauthorizedException();
    }

    return {
      userId: payload.userId,
      issuedAt: payload.issuedAt,
    };
  }
}
