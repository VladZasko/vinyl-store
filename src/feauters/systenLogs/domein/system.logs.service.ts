import { Injectable } from '@nestjs/common';
import { AddLogsDto } from '../model/dto/AddLogsDto';
import { SystemLogsRepository } from '../repository/system.logs.remository';

@Injectable()
export class SystemLogsService {
  constructor(protected systemLogsRepository: SystemLogsRepository) {}

  async addLogs(addLogsDto: AddLogsDto) {
    const newLogs = {
      actions: addLogsDto.actions,
      entity: addLogsDto.entity,
      userId: addLogsDto.userId,
      createdAt: new Date().toISOString(),
    };

    return this.systemLogsRepository.addSystemLogs(newLogs);
  }
}
