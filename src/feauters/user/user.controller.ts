import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Response,
  Body,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  Get,
} from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './domain/auth.service';
import { newPasswordModel } from './model/input/NewPasswordModel';
import { RefreshTokenGuard } from './guard/refresh-token.guard';
import { CreateUserModel } from './model/input/CreateAuthUserModel';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AuthQueryRepository } from './repository/auth.query.repository';

@Controller('auth')
export class AuthController {
  constructor(
    protected authService: AuthService,
    protected authQueryRepository: AuthQueryRepository,
  ) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Request() req, @Response({ passthrough: true }) res) {
    const accessToken = await this.authService.login(req.user.id);

    const dataRefreshToken = {
      issuedAt: new Date().toISOString(),
      userId: req.user.id,
      deviseName: req.headers['user-agent'] ?? 'Device',
    };

    const refreshToken = await this.authService.refreshToken(dataRefreshToken);

    await this.authService.createRefreshTokensMeta(dataRefreshToken);

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .send({
        accessToken: accessToken,
      });
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(@Request() req, @Response({ passthrough: true }) res) {
    const dataRefreshToken = {
      issuedAt: new Date().toISOString(),
      ...req.refreshTokenMeta,
    };

    try {
      const accessToken = await this.authService.login(req.userId);
      const newRefreshToken =
        await this.authService.refreshToken(dataRefreshToken);
      await this.authService.updateRefreshTokensMeta(dataRefreshToken);

      res
        .cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: true,
        })
        .send({
          accessToken: accessToken,
        });
    } catch (error) {
      throw new UnauthorizedException([
        {
          message: 'Access Denied. No refresh token provided.',
          field: 'refreshToken',
        },
      ]);
    }

    return;
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() inputModel: CreateUserModel) {
    const dateOfBirth = new Date(inputModel.dateOfBirth);
    console.log(dateOfBirth);
    const newUser = await this.authService.createUser(inputModel);

    if (!newUser) {
      throw new BadRequestException('User not create');
    }

    return newUser;
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Body('code') code: string) {
    const result = await this.authService.sendConfirmationCode(code);

    if (!result) {
      throw new BadRequestException([
        { message: 'Confirmation code is incorrect', field: 'code' },
      ]);
    }
    return;
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(@Body('email') email: string) {
    const result = await this.authService.resendingConfirmationCode(email);
    if (result) {
      return;
    } else {
      throw new BadRequestException([
        { message: 'email dont sent', field: 'email' },
      ]);
    }
  }

  @Post('password-recovery')
  async passwordRecovery(@Body() email: string) {
    await this.authService.recoveryPassword(email);
    return;
  }
  @Post('new-password')
  async newPassword(@Body() inputModel: newPasswordModel) {
    await this.authService.updatePassword(inputModel);
    return;
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(@Request() req) {
    const foundDevice = await this.authService.deleteRefreshTokensMeta(
      req.refreshTokenMeta!.userId,
    );
    if (!foundDevice) {
      throw new NotFoundException();
    }
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req) {
    const user = await this.authQueryRepository.getUserById(req.user.userId);
    if (!user) throw new UnauthorizedException();
    return {
      email: user.email,
      login: user.login,
      userId: user.id,
    };
  }
}
