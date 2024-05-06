import { SystemLogsDBType } from '../../../db/schemes/system.logs.schemes';
import { SystemLogsViewType } from '../model/output/SystemLogsViewModel';

export const systemLogsMapper = (
  systemLogsDb: SystemLogsDBType,
): SystemLogsViewType => {
  return {
    actions: systemLogsDb.actions,
    entity: systemLogsDb.entity,
    userId: systemLogsDb.userId,
    createdAt: systemLogsDb.createdAt,
  };
};
