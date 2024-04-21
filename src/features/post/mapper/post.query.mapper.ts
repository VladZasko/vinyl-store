import { LikesStatus } from '../models/input/LikesModule';

export const postQueryMapper = (posts: any, likes: any, Id?: string) => {
  const isLiked = likes.filter(
    (obj) => obj.userId === Id && obj.postId === posts._id,
  );

  let likeStatus = LikesStatus.None;

  if (isLiked.length === 1) {
    likeStatus = LikesStatus.Like;
  }

  const likesCount = likes.filter((obj) => obj.postId === posts._id);

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
