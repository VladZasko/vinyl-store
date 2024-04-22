import { PostsViewTypeWithLike } from './PostViewModel';

export type PostPaginationModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostsViewTypeWithLike[];
};
