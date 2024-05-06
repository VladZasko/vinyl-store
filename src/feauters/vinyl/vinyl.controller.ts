import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { VinylService } from './domain/vinyl.service';
import { VinylQueryRepository } from './repository/vinyl.query.repository';
import { CreateVinylModel } from './model/input/CreateVinylModel';
import { QueryVinylUnauthorizedModel } from './model/input/QueryVinylUnauthorizedModel';
import { QueryVinylModel } from './model/input/QueryVinylModel';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateReviewModel } from './model/input/CreateReviewModel';
import { QueryReviewModel } from './model/input/QueryReviewModel';
import { Roles } from '../../utils/customDecorators/roles.decorator';
import { RoleGuard } from '../auth/guard/role.guard';
import {
  Actions,
  AddLogsDto,
  Entity,
} from '../systenLogs/model/dto/AddLogsDto';
import { SystemLogsService } from '../systenLogs/domein/system.logs.service';
import { VinylsAllUsersViewModel } from './model/output/VinylsAllUsersViewModel';
import { VinylsType, VinylsViewModel } from './model/output/VinylsViewModel';
import { ReviewsViewModel } from './model/output/ReviewByVinylViewModel';
import { CreateReviewDto } from './model/dto/CreateReviewDto';
import { BuyVinylViewModel } from './model/output/BuyVinylViewModel';

@Controller('vinyl')
export class VinylController {
  constructor(
    protected vinylService: VinylService,
    protected systemLogsService: SystemLogsService,
    protected vinylQueryRepository: VinylQueryRepository,
  ) {}

  @Get('unauthorized')
  async getVinylsUnauthorized(
    @Query() query: QueryVinylUnauthorizedModel,
  ): Promise<VinylsAllUsersViewModel> {
    const vinyl: VinylsAllUsersViewModel =
      await this.vinylQueryRepository.findVinylUnauthorized(query);
    if (!vinyl) {
      throw new NotFoundException('Vinyl not found');
    }
    return vinyl;
  }

  @Get()
  async getVinyls(@Query() query: QueryVinylModel): Promise<VinylsViewModel> {
    const vinyl: VinylsViewModel =
      await this.vinylQueryRepository.findVinyls(query);
    if (!vinyl) {
      throw new NotFoundException('Vinyl not found');
    }
    return vinyl;
  }

  @Get(':id')
  async getVinylById(@Param('id') vinylId: string): Promise<VinylsType> {
    const vinyl: VinylsType =
      await this.vinylQueryRepository.getVinylId(vinylId);
    if (!vinyl) {
      throw new NotFoundException('Vinyl not found');
    }
    return vinyl;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/review')
  async getReviewByPost(
    @Query() query: QueryReviewModel,
    @Param('id') vinylId: string,
  ): Promise<ReviewsViewModel> {
    const findVinyl = await this.vinylQueryRepository.getVinylById(vinylId);
    if (!findVinyl) {
      throw new NotFoundException('Vinyl not found');
    }

    const reviewByVinyl: ReviewsViewModel =
      await this.vinylQueryRepository.getReviewByVinylId(query, vinylId);

    if (!reviewByVinyl) {
      throw new NotFoundException('Vinyl not found');
    }
    return reviewByVinyl;
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  async createVinyl(@Request() req, @Body() inputModel: CreateVinylModel) {
    const newVinyl: VinylsType =
      await this.vinylService.createVinyl(inputModel);

    const logsData: AddLogsDto = {
      actions: Actions.Create,
      entity: Entity.Vinyl,
      userId: req.user.userId,
    };
    await this.systemLogsService.addLogs(logsData);

    return newVinyl;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/review')
  async createReviewByVinyl(
    @Request() req,
    @Body() inputModel: CreateReviewModel,
    @Param('id') vinylId: string,
  ): Promise<boolean> {
    const findVinyl = await this.vinylQueryRepository.getVinylById(vinylId);

    if (!findVinyl) {
      throw new NotFoundException('Vinyl not found');
    }

    const createReviewData: CreateReviewDto = {
      ...inputModel,
      vinylId: vinylId,
    };

    const newReview: boolean = await this.vinylService.createReviewByVinyl(
      req.user.userId,
      createReviewData,
    );

    const logsData: AddLogsDto = {
      actions: Actions.Create,
      entity: Entity.Review,
      userId: req.user.userId,
    };
    await this.systemLogsService.addLogs(logsData);

    return newReview;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/buy')
  async buyVinyl(@Request() req, @Param('id') vinylId: string) {
    const findVinyl = await this.vinylQueryRepository.getVinylById(vinylId);

    if (!findVinyl) {
      throw new NotFoundException('Vinyl is not found');
    }

    if (findVinyl.quantity <= 0) {
      throw new BadRequestException('There is no such quantity in stock');
    }

    const buyVinyl: BuyVinylViewModel = await this.vinylService.buyVinyl(
      req.user.userId,
      findVinyl,
    );

    return buyVinyl;
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put(':id')
  async updateVinyl(
    @Request() req,
    @Param('id') vinylId: string,
    @Body() inputModel: CreateVinylModel,
  ): Promise<boolean> {
    const updateVinyl: boolean = await this.vinylService.updateVinyl(
      vinylId,
      inputModel,
    );

    const logsData: AddLogsDto = {
      actions: Actions.Update,
      entity: Entity.Vinyl,
      userId: req.user.userId,
    };
    await this.systemLogsService.addLogs(logsData);

    return updateVinyl;
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteVinyl(@Request() req, @Param('id') vinylId: string) {
    const deleteVinyl: boolean = await this.vinylService.deleteVinyl(vinylId);
    if (deleteVinyl === false) {
      throw new NotFoundException('User not found');
    }

    const logsData: AddLogsDto = {
      actions: Actions.Delete,
      entity: Entity.Vinyl,
      userId: req.user.userId,
    };
    await this.systemLogsService.addLogs(logsData);

    return deleteVinyl;
  }
}
