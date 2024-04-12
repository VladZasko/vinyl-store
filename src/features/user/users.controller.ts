import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UsersService } from './domain/users.servis';
import { CreateUserModel } from './models/input/CreateUserModel';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersRepository } from './repository/user.repository';
import { UpdateUserModel } from './models/input/UpdateUserModel';
import { UserViewModel } from './models/output/UserViewModel';
import { ProfileViewModel } from './models/output/ProfileViewModel';

@Controller('users')
export class UserController {
  constructor(
    protected usersService: UsersService,
    protected usersRepository: UsersRepository,
  ) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Request() req): Promise<{ accessToken: string }> {
    const accessToken: string = await this.usersService.login(req.user.userId);

    return {
      accessToken: accessToken,
    };
  }

  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  async registration(
    @Body() inputModel: CreateUserModel,
  ): Promise<UserViewModel> {
    const newUser: UserViewModel =
      await this.usersService.createUser(inputModel);

    if (!newUser) throw new BadRequestException('User not create');

    return newUser;
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-profile')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUser(
    @Request() req,
    @Body() inputModel: UpdateUserModel,
  ): Promise<void> {
    const user: UserViewModel = await this.usersRepository.getUserById(
      req.user.userId,
    );

    const updateUser: boolean = await this.usersService.updateUser(
      user,
      inputModel,
    );

    if (!updateUser) throw new BadRequestException('User not update');

    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req): Promise<ProfileViewModel> {
    const user: UserViewModel = await this.usersRepository.getUserById(
      req.user.userId,
    );

    if (!user) throw new UnauthorizedException();

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }
}
