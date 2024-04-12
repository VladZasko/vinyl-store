import { PostsType } from '../../../../memoryDb/db';
import { LikesStatus } from '../input/LikesModule';

export type PostsViewType = Omit<PostsType, 'userId'>;

export type PostsViewTypeWithLike = PostsViewType & {
  likeStatus: LikesStatus;
  countLikes: number;
};
