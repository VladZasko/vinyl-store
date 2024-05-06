import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../repository/auth.repository';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns/add';
import { EmailAdapterDto } from '../model/input/EmailAdapterDto';
import { EmailAdapter } from '../../../adapter/email-adapter';
import { CreateUserModel } from '../model/input/CreateAuthUserModel';
import { UserViewModel } from '../model/output/UserViewModel';
import { LocalAuthUserModel } from '../model/input/LocalAuthUserModel';
import { userMapper } from '../mapper/user.mapper';
import { RefreshTokenDto } from '../model/dto/RefreshTokenDto';
import { RoleForUser } from '../model/dto/CreateUserDto';

@Injectable()
export class AuthService {
  constructor(
    protected authRepository: AuthRepository,
    private emailAdapter: EmailAdapter,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async login(dataRefreshToken: RefreshTokenDto): Promise<string> {
    const payload = {
      userId: dataRefreshToken.userId,
      issuedAt: dataRefreshToken.issuedAt,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('auth.JWT_SECRET'),
      expiresIn: this.configService.get('auth.ACCESS_TOKEN_TIME'),
    });
  }
  async signIn(user: any): Promise<any> {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    const findUser = await this.authRepository.findByEmail(user.email);

    if (!findUser) {
      return this.createUserFromGoogle(user);
    }
    const dataRefreshToken = {
      issuedAt: new Date().toISOString(),
      userId: findUser._id.toString(),
      deviseName: 'Device',
    };
    const accessToken = await this.login(dataRefreshToken);
    const refreshToken = await this.refreshToken(dataRefreshToken);
    await this.createRefreshTokensMeta(dataRefreshToken);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async createUserFromGoogle(inputModel: any) {
    const newUser = {
      accountData: {
        lastName: inputModel.lastName,
        firstName: inputModel.firstName,
        email: inputModel.email,
        dateOfBirth: 'None',
        createdAt: new Date().toISOString(),
        avatar: this.configService.get('aws.DEFAULT_AVATAR'),
        role: RoleForUser.Costumer,
      },
    };

    const createResult = await this.authRepository.createUser(newUser);
    const dataRefreshToken = {
      issuedAt: new Date().toISOString(),
      userId: createResult.id,
      deviseName: 'Device',
    };

    const accessToken = await this.login(dataRefreshToken);
    const refreshToken = await this.refreshToken(dataRefreshToken);
    await this.createRefreshTokensMeta(dataRefreshToken);

    return { accessToken, refreshToken };
  }
  async createUser(inputModel: CreateUserModel): Promise<UserViewModel> {
    const foundUser = await this.authRepository.findByEmail(inputModel.email);

    if (foundUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const passwordSalt: string = await bcrypt.genSalt(10);
    const passwordHash: string = await this._generateHash(
      inputModel.password,
      passwordSalt,
    );

    const newUser = {
      accountData: {
        lastName: inputModel.lastName,
        firstName: inputModel.firstName,
        email: inputModel.email,
        dateOfBirth: new Date(inputModel.dateOfBirth).toISOString(),
        createdAt: new Date().toISOString(),
        avatar: this.configService.get('aws.DEFAULT_AVATAR'),
        role: RoleForUser.Costumer,
        passwordHash,
        passwordSalt,
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          minutes: this.configService.get('auth.CONFIRMATION_CODE_TIME'),
        }).toISOString(),
        isConfirmed: false,
      },
    };
    const createResult = await this.authRepository.createUser(newUser);

    const emailAdapterDto: EmailAdapterDto = {
      email: newUser.accountData.email,
      confirmationCode: newUser.emailConfirmation.confirmationCode,
    };
    await this.emailAdapter.sendCode(emailAdapterDto);

    return createResult;
  }

  async confirmEmail(code: string): Promise<boolean> {
    const user = await this.authRepository.findUserByConfirmationCode(code);
    if (!user) return false;
    if (user.emailConfirmation!.isConfirmed) return false;
    if (user.emailConfirmation!.confirmationCode !== code) return false;
    if (user.emailConfirmation!.expirationDate < new Date().toISOString())
      return false;

    return await this.authRepository.updateConfirmation(user._id);
  }

  async resendingConfirmationCode(email: string): Promise<boolean> {
    const user = await this.authRepository.findByEmail(email);
    if (!user) return false;
    if (user.emailConfirmation.isConfirmed) return false;

    const newConfirmationCode = uuidv4();
    const newExpirationDate = add(new Date(), {
      minutes: 15,
    });

    const result = await this.authRepository.newConfirmationCode(
      user._id,
      newExpirationDate,
      newConfirmationCode,
    );

    const resendingConfirmEmailDto: EmailAdapterDto = {
      email: user.accountData.email,
      newCode: newConfirmationCode,
    };
    await this.emailAdapter.sendNewCode(resendingConfirmEmailDto);

    return result;
  }

  async checkCredentials(
    checkCredentialsDto: LocalAuthUserModel,
  ): Promise<UserViewModel | null> {
    const user = await this.authRepository.findByEmail(
      checkCredentialsDto.email,
    );
    if (!user) {
      return null;
    }

    const passwordHash = await this._generateHash(
      checkCredentialsDto.password,
      user.accountData.passwordHash,
    );

    if (user.accountData.passwordHash !== passwordHash) {
      return null;
    }

    return userMapper(user);
  }

  async refreshToken(dataRefreshToken: RefreshTokenDto): Promise<string> {
    const payload: RefreshTokenDto = {
      deviseName: dataRefreshToken.deviseName,
      userId: dataRefreshToken.userId,
      issuedAt: dataRefreshToken.issuedAt,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('auth.JWT_SECRET'),
      expiresIn: this.configService.get('auth.REFRESH_TOKEN_TIME'),
    });
  }

  async createRefreshTokensMeta(dataRefreshToken: RefreshTokenDto) {
    const findRefreshTokenMeta =
      await this.authRepository.findRefreshTokensMeta(dataRefreshToken.userId);

    let refreshTokenMeta;

    if (findRefreshTokenMeta) {
      refreshTokenMeta =
        await this.authRepository.updateRefreshTokensMeta(dataRefreshToken);
    } else {
      refreshTokenMeta =
        await this.authRepository.createRefreshTokensMeta(dataRefreshToken);
    }
    return refreshTokenMeta;
  }

  async updateRefreshTokensMeta(refreshTokenUpdateData: RefreshTokenDto) {
    return this.authRepository.updateRefreshTokensMeta(refreshTokenUpdateData);
  }

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }

  async deleteRefreshTokensMeta(userId: string) {
    return this.authRepository.deleteRefreshTokensMeta(userId);
  }
}
