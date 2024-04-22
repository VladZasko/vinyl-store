import { LikesStatus } from '../../../post/models/input/LikesModule';

export type UsersViewModel = {
  login: string;
  lastName: string;
  firstName: string;
  firstPost:
    | {
        fullName: string;
        title: string;
        description: string;
        createdAt: string;
        likesCount: number;
        likeStatus: LikesStatus;
      }
    | 'None';
};
export type UsersPaginationModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UsersViewModel[];
};
