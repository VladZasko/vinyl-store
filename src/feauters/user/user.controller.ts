import {
  Controller,
  UseGuards,
  Request,
  UnauthorizedException,
  Get,
  Put,
  HttpCode,
  HttpStatus,
  Body,
  BadRequestException,
  Delete,
  NotFoundException,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { UserService } from './domain/user.service';
import { UserQueryRepository } from './repository/user.query.repository';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UpdateUserModel } from './model/input/UpdateUserModel';
import { QueryVinylModel } from '../vinyl/model/input/QueryVinylModel';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {
  Actions,
  AddLogsDto,
  Entity,
} from '../systenLogs/model/dto/AddLogsDto';
import { SystemLogsService } from '../systenLogs/domein/system.logs.service';
import { UserProfileViewModel } from './model/output/UserProfileViewModel';
import { MyReviewViewModel } from './model/output/MyReviewViewModel';
import { MyVinylViewModel } from './model/output/MyVinylViewModel';

@Controller('user')
export class UserController {
  constructor(
    protected userService: UserService,
    protected systemLogsService: SystemLogsService,
    protected userQueryRepository: UserQueryRepository,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req) {
    const user: UserProfileViewModel =
      await this.userQueryRepository.getUserById(req.user.userId);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-review')
  async myReview(
    @Request() req,
    @Query() query: QueryVinylModel,
  ): Promise<MyReviewViewModel> {
    const user: MyReviewViewModel = await this.userQueryRepository.getMyReview(
      req.user.userId,
      query,
    );
    if (!user) throw new UnauthorizedException();
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-vinyls')
  async myVinyls(
    @Request() req,
    @Query() query: QueryVinylModel,
  ): Promise<MyVinylViewModel> {
    const user: MyVinylViewModel = await this.userQueryRepository.myVinyls(
      req.user.userId,
      query,
    );
    if (!user) throw new UnauthorizedException();
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('upload-avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: null,
    }),
  )
  async uploadFile(
    @Request() req,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image/jpeg' })
        .addMaxSizeValidator({ maxSize: 2 * 1024 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    const logsData: AddLogsDto = {
      actions: Actions.Update,
      entity: Entity.User,
      userId: req.user.userId,
    };
    await this.systemLogsService.addLogs(logsData);

    return this.userService.uploadAvatar(req.user.userId, file);
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

    const logsData: AddLogsDto = {
      actions: Actions.Update,
      entity: Entity.User,
      userId: req.user.userId,
    };
    await this.systemLogsService.addLogs(logsData);

    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Request() req): Promise<boolean> {
    const deleteUser: boolean = await this.userService.deleteUserById(
      req.user.userId,
    );
    if (deleteUser === false) {
      throw new NotFoundException('User not found');
    }

    const logsData: AddLogsDto = {
      actions: Actions.Delete,
      entity: Entity.User,
      userId: req.user.userId,
    };
    await this.systemLogsService.addLogs(logsData);

    return deleteUser;
  }
}
