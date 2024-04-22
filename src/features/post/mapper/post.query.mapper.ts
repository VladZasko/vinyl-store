import { LikesStatus } from '../models/input/LikesModule';
import { PostMongoType } from '../../../db/mongoDb/schemes/post.schemes';
import { LikeMongoType } from '../../../db/mongoDb/schemes/like.schemes';
import { PostsViewTypeWithLike } from '../models/output/PostViewModel';

export const postQueryMapper = (
  posts: PostMongoType,
  likes: LikeMongoType[],
  id: string,
): PostsViewTypeWithLike => {
  const isLiked: LikeMongoType[] = likes.filter(
    (obj: LikeMongoType) => obj.userId === id && obj.postId === posts._id,
  );

  let likeStatus: LikesStatus = LikesStatus.None;

  if (isLiked.length === 1) {
    likeStatus = LikesStatus.Like;
  }

  const likesCount: LikeMongoType[] = likes.filter(
    (obj: LikeMongoType) => obj.postId === posts._id,
  );

  return {
    id: posts._id,
    fullName: posts.fullName,
    title: posts.title,
    description: posts.description,
    createdAt: posts.createdAt,
    likesCount: likesCount.length,
    likeStatus: likeStatus,
  };
};
