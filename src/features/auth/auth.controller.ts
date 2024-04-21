import {
  Controller,
  HttpCode,
  HttpStatus,
  Request,
  Post,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { AuthService } from './domain/auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) protected authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Request() req): Promise<{ accessToken: string }> {
    const accessToken: string = await this.authService.login(req.user.id);

    return {
      accessToken: accessToken,
    };
  }
}
