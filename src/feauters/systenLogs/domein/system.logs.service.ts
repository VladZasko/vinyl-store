import { Injectable } from '@nestjs/common';
import { InjectModel, Prop } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SystemLogsDBType,
  SystemLogsDocument,
} from '../../db/schemes/system.logs.schemes';
import { addLogsDtoType } from './model/input/AddLogsDto';

@Injectable()
export class SystemLogsService {
  constructor(
    @InjectModel(SystemLogsDBType.name)
    private systemLogsModel: Model<SystemLogsDocument>,
  ) {}

  async addLogs(addLogsDto: addLogsDtoType) {
    const newLogs = {
      actions: addLogsDto.actions,
      entity: addLogsDto.entity,
      userId: addLogsDto.userId,
      createdAt: new Date().toISOString(),
    };

    const addLogs = await this.systemLogsModel.create(newLogs);
    await addLogs.save();

    return;
  }
}
