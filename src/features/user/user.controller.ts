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
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './domain/user.service';
import { CreateUserModel } from './models/input/CreateUserModel';
import { UserSqlRepository } from './repository/user.sql.repository';
import { UpdateUserModel } from './models/input/UpdateUserModel';
import { UserViewModel } from './models/output/UserViewModel';
import { ProfileViewModel } from './models/output/ProfileViewModel';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserMongoDbQueryRepository } from './repository/user.mongoDb.query.repository';
import { QueryPostsModel } from '../post/models/input/QueryPostModule';

@Controller('users')
export class UserController {
  constructor(
    @Inject(UserService) protected userService: UserService,
    @Inject(UserSqlRepository) protected userRepository: UserSqlRepository,
    @Inject(UserMongoDbQueryRepository)
    protected userMongoQueryRepository: UserMongoDbQueryRepository,
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
    const updateUser: boolean = await this.userService.updateUser(
      req.user.userId,
      inputModel,
    );

    if (!updateUser) throw new BadRequestException('User not update');

    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req): Promise<ProfileViewModel> {
    const user: ProfileViewModel =
      await this.userMongoQueryRepository.getUserById(req.user.userId);

    if (!user) throw new UnauthorizedException();

    return user;
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUser(@Query() query: QueryPostsModel, @Request() req) {
    const user = await this.userMongoQueryRepository.getAllUser(
      query,
      req.user.userId,
    );

    return user;
  }
}
