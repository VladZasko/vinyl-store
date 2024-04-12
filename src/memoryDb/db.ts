export type UserType = {
  userId: string;
  login: string;
  email: string;
  lastName: string;
  firstName: string;
  createdAt: string;
  passwordHash: string;
  passwordSalt: string;
};

export interface PostsType {
  userId: string;
  postId: string;
  fullName: string;
  title: string;
  description: string;
  createdAt: string;
}

export type LikesType = {
  userId: string;
  postId: string;
};

export type DBType = {
  users: UserType[];
  posts: PostsType[];
  likes: LikesType[];
};

export const db: DBType = {
  users: [],
  posts: [],
  likes: [],
};
