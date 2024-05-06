import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuerySystemLogsModel } from '../model/input/QuerySystemLogsModel';
import {
  SystemLogsDBType,
  SystemLogsDocument,
} from '../../../db/schemes/system.logs.schemes';
import { systemLogsMapper } from '../mapper/system.logs.mapper';
import { Actions, Entity } from '../model/dto/AddLogsDto';
import { SystemLogsViewModel } from '../model/output/SystemLogsViewModel';

@Injectable()
export class SystemLogsQueryRepository {
  constructor(
    @InjectModel(SystemLogsDBType.name)
    private systemLogsModel: Model<SystemLogsDocument>,
  ) {}

  async getSystemLogsByUserId(
    userId: string,
    term: QuerySystemLogsModel,
  ): Promise<SystemLogsViewModel> {
    const actions: Actions = term.actions ?? null;
    const entity: Entity = term.entity ?? null;
    const sortBy: string = term.sortBy ?? 'createdAt';
    const sortDirection: 'asc' | 'desc' = term.sortDirection ?? 'desc';
    const pageNumber: number = term.pageNumber ?? 1;
    const pageSize: number = term.pageSize ?? 10;

    let filter: any = { userId: userId };
    if (actions) {
      filter = { userId: userId, actions: actions };
    }
    if (entity) {
      filter = { userId: userId, entity: entity };
    }
    if (actions && entity) {
      filter = { userId: userId, actions: actions, entity: entity };
    }

    const systemLogs = await this.systemLogsModel
      .find(filter)
      .sort([[sortBy, sortDirection]])
      .skip((pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .lean();

    const totalCount: number =
      await this.systemLogsModel.countDocuments(filter);

    const pagesCount: number = Math.ceil(totalCount / +pageSize);

    return {
      pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: systemLogs.map((systemLogs) => systemLogsMapper(systemLogs)),
    };
  }

  async getSystemLogs(
    term: QuerySystemLogsModel,
  ): Promise<SystemLogsViewModel> {
    const actions: Actions = term.actions ?? null;
    const entity: Entity = term.entity ?? null;
    const sortBy: string = term.sortBy ?? 'createdAt';
    const sortDirection: 'asc' | 'desc' = term.sortDirection ?? 'desc';
    const pageNumber: number = term.pageNumber ?? 1;
    const pageSize: number = term.pageSize ?? 10;

    let filter = {};

    if (actions) {
      filter = { actions: actions };
    }
    if (entity) {
      filter = { entity: entity };
    }
    if (actions && entity) {
      filter = { actions: actions, entity: entity };
    }

    const systemLogs = await this.systemLogsModel
      .find(filter)
      .sort([[sortBy, sortDirection]])
      .skip((pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .lean();

    const totalCount: number =
      await this.systemLogsModel.countDocuments(filter);

    const pagesCount: number = Math.ceil(totalCount / +pageSize);

    return {
      pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: systemLogs.map((systemLogs) => systemLogsMapper(systemLogs)),
    };
  }
}
