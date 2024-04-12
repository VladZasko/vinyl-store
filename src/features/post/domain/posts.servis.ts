import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../repository/posts.repository';
import { PostsViewType } from '../models/output/PostsViewModel';
import { CreatePostDTO } from '../models/input/CreatePostModel';
import { LikesType, PostsType } from '../../../memoryDb/db';
import { UpdatePostDTO } from '../models/input/UpdatePostModel';

@Injectable()
export class PostsService {
  constructor(protected postsRepository: PostsRepository) {}

  async createPost(createData: CreatePostDTO): Promise<PostsViewType> {
    const newPost: PostsType = {
      fullName: createData.fullName,
      title: createData.title,
      description: createData.description,
      userId: createData.userId,
      postId: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    return await this.postsRepository.createPost(newPost);
  }
  async updatePost(upData: UpdatePostDTO): Promise<boolean> {
    return await this.postsRepository.updatePost(upData);
  }

  async updateLikeStatus(upData: LikesType): Promise<boolean> {
    return await this.postsRepository.updateLike(upData);
  }
  async deletePostById(id: string): Promise<boolean> {
    return await this.postsRepository.deletePostById(id);
  }
}
