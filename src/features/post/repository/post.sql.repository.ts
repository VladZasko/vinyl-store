import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../../db/entity/post.entity';
import { Like } from '../../../db/entity/like.entity';
import { PostsType } from '../models/PostType';

@Injectable()
export class PostSqlRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async getPostById(id: string) {
    return this.postRepository.findOneBy({ id: id });
  }

  async createPost(createData: PostsType) {
    return this.postRepository.save(createData);
  }

  async updatePost(upData: Post) {
    return this.postRepository.save(upData);
  }

  async findLike(likesData: any): Promise<Like> {
    return this.likeRepository
      .createQueryBuilder('like')
      .where('like.postId = :postId', { postId: likesData.postId })
      .andWhere('like.userId = :userId', { userId: likesData.userId })
      .getOne();
  }

  async createLike(likesData: any): Promise<Like> {
    return this.likeRepository.save(likesData);
  }

  async deleteLikeById(id: string) {
    return await this.likeRepository.delete(id);
  }

  async deletePostById(id: string) {
    return await this.postRepository.delete(id);
  }
}
