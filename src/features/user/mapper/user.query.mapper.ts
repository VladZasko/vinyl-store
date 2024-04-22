import { LikesStatus } from '../../post/models/input/LikesModule';
import { UserMongoType } from '../../../db/mongoDb/schemes/user.schemes';
import { LikeMongoType } from '../../../db/mongoDb/schemes/like.schemes';
import { PostMongoType } from '../../../db/mongoDb/schemes/post.schemes';
import { UsersViewModel } from '../models/output/UserPaginationModel';

export const userQueryMapper = (
  users: UserMongoType,
  likes: LikeMongoType[],
  posts: PostMongoType[],
  id: string,
): UsersViewModel => {
  const postsByUser: PostMongoType[] = posts.filter(
    (post: PostMongoType) => post.userId === users._id,
  );

  let firstPost: string | any = 'None';

  if (postsByUser.length > 0) {
    firstPost = postsByUser.reduce((acc: PostMongoType, arr: PostMongoType) =>
      acc.createdAt < arr.createdAt ? acc : arr,
    );

    const isLiked: LikeMongoType[] = likes.filter(
      (obj: LikeMongoType) => obj.userId === id && obj.postId === firstPost._id,
    );

    let likeStatus: LikesStatus = LikesStatus.None;

    if (isLiked.length === 1) {
      likeStatus = LikesStatus.Like;
    }

    const likesCount: number = likes.filter(
      (obj: LikeMongoType) => obj.postId === firstPost._id,
    ).length;

    firstPost = {
      fullName: firstPost.fullName,
      title: firstPost.title,
      description: firstPost.description,
      createdAt: firstPost.createdAt,
      likesCount: likesCount,
      likeStatus: likeStatus,
    };
  }

  return {
    login: users.login,
    lastName: users.lastName,
    firstName: users.lastName,
    firstPost: firstPost,
  };
};
