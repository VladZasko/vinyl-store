import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../repository/auth.repository';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns/add';
import { EmailAdapterDto } from '../model/input/EmailAdapterDto';
import { EmailAdapter } from '../adapter/email-adapter';
import { newPasswordModel } from '../model/input/NewPasswordModel';
import { CreateUserModel } from '../model/input/CreateAuthUserModel';
import { UserViewModel } from '../model/output/UserViewModel';
import { LocalAuthUserModel } from '../model/input/LocalAuthUserModel';
import { userMapper } from '../mapper/user.mapper';

config();

@Injectable()
export class AuthService {
  constructor(
    protected authRepository: AuthRepository,
    private emailAdapter: EmailAdapter,
    private readonly jwtService: JwtService,
  ) {}
  async login(userId: string) {
    const payload = { sub: userId };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    });
  }

  async createUser(
    inputModel: CreateUserModel,
  ): Promise<UserViewModel | boolean> {
    const foundUser = await this.authRepository.findByEmail(inputModel.email);

    if (foundUser) {
      return false;
    }

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      inputModel.password,
      passwordSalt,
    );

    const newUser = {
      accountData: {
        login: inputModel.login,
        lastName: inputModel.lastName,
        firstName: inputModel.firstName,
        email: inputModel.email,
        dateOfBirth: new Date(inputModel.dateOfBirth).toISOString(),
        createdAt: new Date().toISOString(),
        passwordHash,
        passwordSalt,
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          minutes: 15,
        }),
        resendingCode: new Date(),
        isConfirmed: false,
      },
    };
    const createResult = await this.authRepository.createUser(newUser);
    try {
      const emailAdapterDto: EmailAdapterDto = {
        email: newUser.accountData.email,
        confirmationCode: newUser.emailConfirmation.confirmationCode,
      };
      await this.emailAdapter.sendCode(emailAdapterDto);
    } catch (error) {
      console.error(error);
      return false;
    }
    return createResult;
  }

  async sendConfirmationCode(code: string): Promise<boolean> {
    const user = await this.authRepository.findUserByConfirmationCode(code);
    if (!user) return false;
    if (user.emailConfirmation!.isConfirmed) return false;
    if (user.emailConfirmation!.confirmationCode !== code) return false;
    if (user.emailConfirmation!.expirationDate < new Date()) return false;

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
    try {
      await this.emailAdapter.sendNewCode(resendingConfirmEmailDto);
    } catch (error) {
      console.error(error);
      return false;
    }

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

  async recoveryPassword(email: string): Promise<boolean> {
    const user = await this.authRepository.findByEmail(email);
    if (!user) return true;

    const passwordRecoveryCode = uuidv4();
    const expirationDate = add(new Date(), {
      minutes: 15,
    });

    const result = await this.authRepository.passwordRecovery(
      user!._id,
      passwordRecoveryCode,
      expirationDate,
    );

    const sendRecoveryCodeDto: EmailAdapterDto = {
      email: user.accountData.email,
      recoveryCode: passwordRecoveryCode,
    };
    try {
      await this.emailAdapter.sendRecoveryCode(sendRecoveryCodeDto);
    } catch (error) {
      console.error(error);
      return false;
    }

    return result;
  }

  async refreshToken(dataRefreshToken: any) {
    const payload = {
      deviceId: dataRefreshToken.deviceId,
      id: dataRefreshToken.userId,
      issuedAt: dataRefreshToken.issuedAt,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_TIME,
    });
  }

  async createRefreshTokensMeta(refreshTokenDto: any) {
    return this.authRepository.createRefreshTokensMeta(refreshTokenDto);
  }

  async updateRefreshTokensMeta(refreshTokenUpdateDto: any) {
    return this.authRepository.updateRefreshTokensMeta(refreshTokenUpdateDto);
  }

  async updatePassword(inputModel: newPasswordModel): Promise<boolean> {
    const user = await this.authRepository.findUserByRecoveryCode(
      inputModel.recoveryCode,
    );
    if (!user) return false;
    if (user.passwordRecovery!.recoveryCode !== inputModel.recoveryCode)
      return false;
    if (user.passwordRecovery!.expirationDate < new Date()) return false;

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      inputModel.newPassword,
      passwordSalt,
    );

    return await this.authRepository.updatePassword(
      user,
      passwordSalt,
      passwordHash,
    );
  }

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }

  async deleteRefreshTokensMeta(userId: string) {
    return this.authRepository.deleteRefreshTokensMeta(userId);
  }
}
