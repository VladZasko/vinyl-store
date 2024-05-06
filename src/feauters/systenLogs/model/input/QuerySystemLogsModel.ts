import { Actions, Entity } from '../dto/AddLogsDto';

export type QuerySystemLogsModel = {
  actions?: Actions;
  entity?: Entity;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
};
