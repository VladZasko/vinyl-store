import { Actions, Entity } from './AddLogsDto';

export type QueryVinylModel = {
  actions?: Actions;
  entity?: Entity;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
};
