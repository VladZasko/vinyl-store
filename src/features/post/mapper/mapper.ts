import { db, LikesType, PostsType } from '../../../memoryDb/db';
import { PostsViewTypeWithLike } from '../models/output/PostsViewModel';
import { LikesStatus } from '../models/input/LikesModule';

export const mapper = (
  postDb: PostsType,
  userId: string,
): PostsViewTypeWithLike => {
  const isLiked: LikesType = db.likes.find(
    (c: LikesType) => c.postId === postDb.postId && c.userId === userId,
  );
  const likesCount: LikesType[] = db.likes.filter(
    (c: LikesType) => c.postId === postDb.postId,
  );

  let likeStatus: LikesStatus = LikesStatus.None;

  if (isLiked) {
    likeStatus = LikesStatus.Like;
  }

  return {
    postId: postDb.postId,
    fullName: postDb.fullName,
    title: postDb.title,
    description: postDb.description,
    createdAt: postDb.createdAt,
    likeStatus: likeStatus,
    countLikes: likesCount.length,
  };
};
