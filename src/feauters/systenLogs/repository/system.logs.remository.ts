import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SystemLogsDBType,
  SystemLogsDocument,
} from '../../../db/schemes/system.logs.schemes';

@Injectable()
export class SystemLogsRepository {
  constructor(
    @InjectModel(SystemLogsDBType.name)
    private systemLogsModel: Model<SystemLogsDocument>,
  ) {}

  async addSystemLogs(createData: any) {
    const addSystemLogs = await this.systemLogsModel.create(createData);
    await addSystemLogs.save();
    return true;
  }
}
