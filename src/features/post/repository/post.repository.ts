import { Injectable } from '@nestjs/common';
import {
  PostsViewType,
  PostsViewTypeWithLike,
} from '../models/output/PostViewModel';
import { db, LikesType, PostsType } from '../../../memoryDb/db';
import { mapper } from '../mapper/mapper';
import { UpdatePostDTO } from '../models/input/UpdatePostModel';

@Injectable()
export class PostRepository {
  async getAllPosts(userId: string): Promise<PostsViewTypeWithLike[] | null> {
    const posts: PostsType[] = db.posts;
    if (!posts) {
      return null;
    }

    return posts.map((p: PostsType) => mapper(p, userId));
  }
  async getPostsById(userId: string): Promise<PostsViewTypeWithLike[] | null> {
    const posts: PostsType[] = db.posts.filter(
      (v: PostsType) => v.userId === userId,
    );

    if (!posts) {
      return null;
    }

    return posts.map((p: PostsType) => mapper(p, userId));
  }

  async getPostById(id: string): Promise<PostsType | null> {
    const post: PostsType | undefined = db.posts.find(
      (v: PostsType) => v.postId === id,
    );

    if (!post) {
      return null;
    }

    return post;
  }

  async createPost(createData: PostsType): Promise<PostsViewType> {
    db.posts.push(createData);

    return {
      postId: createData.postId,
      fullName: createData.fullName,
      title: createData.title,
      description: createData.description,
      createdAt: createData.createdAt,
    };
  }

  async updatePost(upData: UpdatePostDTO): Promise<boolean> {
    const foundPost: PostsType | undefined = db.posts.find(
      (c: PostsType) => c.postId === upData.postId,
    );

    if (!foundPost) {
      return false;
    }

    foundPost.title = upData.title;
    foundPost.description = upData.description;

    return true;
  }
  async updateLike(likesData: LikesType): Promise<boolean> {
    const isLiked: LikesType = db.likes.find(
      (c: LikesType) =>
        c.postId === likesData.postId && c.userId === likesData.userId,
    );

    if (!isLiked) {
      db.likes.push(likesData);
      return true;
    } else {
      db.likes = db.likes.filter(
        (c: LikesType) =>
          !(c.postId === likesData.postId && c.userId === likesData.userId),
      );
      return true;
    }
  }
  async deletePostById(id: string): Promise<boolean> {
    db.posts = db.posts.filter((v: PostsType) => v.postId !== id);

    return true;
  }
}
