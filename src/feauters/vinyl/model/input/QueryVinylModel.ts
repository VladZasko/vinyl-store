export type QueryVinylModel = {
  searchTitleTerm?: string;
  searchAuthorTerm?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
};
