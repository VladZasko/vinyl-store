import * as bcrypt from 'bcrypt';
import { UserSqlRepository } from '../../user/repository/user.sql.repository';
import { LoginAuthUserModel } from '../model/LoginAuthUserModel';
import { UserViewModel } from '../../user/models/output/UserViewModel';
import { userAuthMapper } from '../mapper/mapper';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../db/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserSqlRepository) protected userRepository: UserSqlRepository,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async checkCredentials(
    loginData: LoginAuthUserModel,
  ): Promise<UserViewModel | null> {
    const user: User | undefined = await this.userRepository.findByEmail(
      loginData.email,
    );
    if (!user) {
      return null;
    }

    const passwordHash: string = await this._generateHash(
      loginData.password,
      user.passwordHash,
    );

    if (user.passwordHash !== passwordHash) {
      return null;
    }

    return userAuthMapper(user);
  }

  async _generateHash(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  async login(userId: string): Promise<string> {
    const payload: { sub: string } = { sub: userId };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    });
  }
}
