import { LikesStatus } from '../../post/models/input/LikesModule';

export const userQueryMapper = (
  users: any,
  likes: any,
  posts: any,
  id: string,
) => {
  const postsByUser = posts.filter((post) => post.userId === users._id);

  let firstPost: string | any = 'None';

  if (postsByUser.length > 0) {
    firstPost = postsByUser.reduce((acc, arr) =>
      acc.createdAt < arr.createdAt ? acc : arr,
    );

    const isLiked = likes.filter(
      (obj) => obj.userId === id && obj.postId === firstPost._id,
    );

    let likeStatus = LikesStatus.None;

    if (isLiked.length === 1) {
      likeStatus = LikesStatus.Like;
    }

    const likesCount = likes.filter(
      (obj) => obj.postId === firstPost._id,
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
