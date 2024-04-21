import { Inject, Injectable } from '@nestjs/common';
import { PostRepository } from '../repository/post.repository';
import { PostsViewType } from '../models/output/PostViewModel';
import { CreatePostDTO } from '../models/input/CreatePostModel';
import { UpdatePostDTO } from '../models/input/UpdatePostModel';
import { Post } from '../../../db/entity/post.entity';

@Injectable()
export class PostService {
  constructor(
    @Inject(PostRepository) protected postsRepository: PostRepository,
  ) {}

  async createPost(createData: CreatePostDTO): Promise<PostsViewType> {
    const newPost: Post = new Post();

    newPost.fullName = createData.fullName;
    newPost.title = createData.title;
    newPost.description = createData.description;
    newPost.userId = createData.userId;
    newPost.createdAt = new Date().toISOString();

    return await this.postsRepository.createPost(newPost);
  }
  async updatePost(upData: UpdatePostDTO): Promise<Post> {
    const post: Post = await this.postsRepository.getPostById(upData.id);

    post.title = upData.title;
    post.description = upData.description;

    return await this.postsRepository.updatePost(post);
  }

  async updateLikeStatus(upData: any): Promise<boolean> {
    return await this.postsRepository.updateLike(upData);
  }
  async deletePostById(id: string): Promise<void> {
    return await this.postsRepository.deletePostById(id);
  }
}
