import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './domain/review.service';
import { Roles } from '../../utils/customDecorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { SystemLogsService } from '../systenLogs/domein/system.logs.service';
import {
  Actions,
  AddLogsDto,
  Entity,
} from '../systenLogs/model/dto/AddLogsDto';

@Controller('review')
export class ReviewController {
  constructor(
    protected reviewService: ReviewService,
    protected systemLogsService: SystemLogsService,
  ) {}

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReview(
    @Request() req,
    @Param('id') reviewId: string,
  ): Promise<boolean> {
    const deleteReview: boolean =
      await this.reviewService.deleteReview(reviewId);
    if (deleteReview === false) {
      throw new NotFoundException('Review not found');
    }

    const logsData: AddLogsDto = {
      actions: Actions.Delete,
      entity: Entity.Review,
      userId: req.user.userId,
    };
    await this.systemLogsService.addLogs(logsData);

    return deleteReview;
  }
}
