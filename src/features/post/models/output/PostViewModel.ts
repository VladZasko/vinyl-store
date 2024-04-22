import { LikesStatus } from '../input/LikesModule';
import { PostsType } from '../PostType';

export type PostsViewType = Omit<PostsType, 'userId'>;

export type PostsViewTypeWithLike = PostsViewType & {
  likeStatus: LikesStatus;
  likesCount: number;
};
