import { Actions, Entity } from '../dto/AddLogsDto';

export type SystemLogsViewType = {
  actions: Actions;
  entity: Entity;
  userId: string;
  createdAt: string;
};

export type SystemLogsViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: SystemLogsViewType[];
};
