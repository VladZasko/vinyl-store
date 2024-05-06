import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuerySystemLogsModel } from './model/input/QuerySystemLogsModel';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from '../../utils/customDecorators/roles.decorator';
import { RoleGuard } from '../auth/guard/role.guard';
import { SystemLogsService } from './domein/system.logs.service';
import { SystemLogsQueryRepository } from './repository/system.logs.query.remository';
import { SystemLogsViewModel } from './model/output/SystemLogsViewModel';

@Controller('system-logs')
export class SystemLogsController {
  constructor(
    protected systemLogsService: SystemLogsService,
    protected systemLogsQueryRepository: SystemLogsQueryRepository,
  ) {}

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(':id')
  async getSystemLogsByUserId(
    @Param('id') userId: string,
    @Query() query: QuerySystemLogsModel,
  ): Promise<SystemLogsViewModel> {
    const systemLogs: SystemLogsViewModel =
      await this.systemLogsQueryRepository.getSystemLogsByUserId(userId, query);

    if (!systemLogs) {
      throw new NotFoundException('SystemLogs not found');
    }

    return systemLogs;
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  async getSystemLogs(
    @Query() query: QuerySystemLogsModel,
  ): Promise<SystemLogsViewModel> {
    const systemLogs: SystemLogsViewModel =
      await this.systemLogsQueryRepository.getSystemLogs(query);

    if (!systemLogs) {
      throw new NotFoundException('SystemLogs not found');
    }

    return systemLogs;
  }
}
