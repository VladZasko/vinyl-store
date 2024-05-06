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
import { RefreshTokenGuard } from './guard/refresh-token.guard';
import { CreateUserModel } from './model/input/CreateAuthUserModel';
import { GoogleOauthGuard } from './guard/google-oauth.guard';
import { SystemLogsService } from '../systenLogs/domein/system.logs.service';
import {
  Actions,
  AddLogsDto,
  Entity,
} from '../systenLogs/model/dto/AddLogsDto';
import { RefreshTokenDto } from './model/dto/RefreshTokenDto';
import { UserViewModel } from './model/output/UserViewModel';

@Controller('auth')
export class AuthController {
  constructor(
    protected authService: AuthService,
    protected systemLogsService: SystemLogsService,
  ) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(
    @Request() req,
    @Response({ passthrough: true }) res,
  ) {
    const token = await this.authService.signIn(req.user);

    res
      .cookie('refreshToken', token.refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .send({
        accessToken: token.accessToken,
      });
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Request() req, @Response({ passthrough: true }) res) {
    const dataRefreshToken: RefreshTokenDto = {
      issuedAt: new Date().toISOString(),
      userId: req.user.id,
      deviseName: req.headers['user-agent'] ?? 'Device',
    };

    const accessToken: string = await this.authService.login(dataRefreshToken);

    const refreshToken: string =
      await this.authService.refreshToken(dataRefreshToken);

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
    const dataRefreshToken: RefreshTokenDto = {
      issuedAt: new Date().toISOString(),
      userId: req.refreshTokenMeta.userId,
      deviseName: req.refreshTokenMeta.deviseName,
    };

    try {
      const accessToken: string =
        await this.authService.login(dataRefreshToken);
      const newRefreshToken: string =
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
      throw new UnauthorizedException(
        'Access Denied. No refresh token provided.',
      );
    }

    return;
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() inputModel: CreateUserModel) {
    const newUser: UserViewModel =
      await this.authService.createUser(inputModel);

    if (!newUser) {
      throw new BadRequestException('User not create');
    }

    const logsData: AddLogsDto = {
      actions: Actions.Create,
      entity: Entity.User,
      userId: newUser.id,
    };
    await this.systemLogsService.addLogs(logsData);
    return;
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Body('code') code: string) {
    const result: boolean = await this.authService.confirmEmail(code);

    if (!result) {
      throw new BadRequestException('Confirmation code is incorrect');
    }
    return;
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(@Body('email') email: string) {
    const result: boolean =
      await this.authService.resendingConfirmationCode(email);
    if (result) {
      return;
    } else {
      throw new BadRequestException('email dont sent');
    }
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
}
