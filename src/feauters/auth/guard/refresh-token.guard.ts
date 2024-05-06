import { config } from 'dotenv';
import { Model } from 'mongoose';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  RefreshTokenMetaDBType,
  RefreshTokenMetaDocument,
} from '../../../db/schemes/token.schemes';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

config();

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(RefreshTokenMetaDBType.name)
    private refreshTokenMetaModel: Model<RefreshTokenMetaDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException([
        {
          message: 'Access Denied. No refresh token provided.',
          field: 'refreshToken',
        },
      ]);
    }

    const user = await this.jwtService.verify(refreshToken, {
      secret: this.configService.get('auth.JWT_SECRET'),
    });

    const refreshTokenMeta = await this.refreshTokenMetaModel.findOne({
      userId: user.userId,
    });

    if (!refreshTokenMeta) {
      throw new UnauthorizedException([
        {
          message: 'Access Denied. No refresh token provided.',
          field: 'refreshToken',
        },
      ]);
    }

    if (refreshTokenMeta?.issuedAt === user.issuedAt) {
      request.user = user;
      request.refreshTokenMeta = refreshTokenMeta;
      return true;
    }
    throw new UnauthorizedException([
      {
        message: 'Access Denied. No refresh token provided.',
        field: 'refreshToken',
      },
    ]);
  }
}
