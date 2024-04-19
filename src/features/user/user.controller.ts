import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './domain/user.service';
import { CreateUserModel } from './models/input/CreateUserModel';
import { UserRepository } from './repository/user.repository';
import { UpdateUserModel } from './models/input/UpdateUserModel';
import { UserViewModel } from './models/output/UserViewModel';
import { ProfileViewModel } from './models/output/ProfileViewModel';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(
    @Inject(UserService) protected userService: UserService,
    @Inject(UserRepository) protected userRepository: UserRepository,
  ) {}

  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  async registration(
    @Body() inputModel: CreateUserModel,
  ): Promise<UserViewModel> {
    const newUser: UserViewModel =
      await this.userService.createUser(inputModel);

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
    const user: UserViewModel = await this.userRepository.getUserById(
      req.user.userId,
    );

    const updateUser: boolean = await this.userService.updateUser(
      user,
      inputModel,
    );

    if (!updateUser) throw new BadRequestException('User not update');

    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req): Promise<ProfileViewModel> {
    const user: UserViewModel = await this.userRepository.getUserById(
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
