import { Injectable } from '@nestjs/common';
import { PostsViewType } from '../models/output/PostViewModel';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../../db/entity/post.entity';
import { Like } from '../../../db/entity/like.entity';
import { QueryPostsModel } from '../models/input/QueryPostModule';
import { mapper } from '../mapper/mapper';
import { PostsType } from '../models/PostType';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}
  async getAllPosts(query: QueryPostsModel) {
    const pageNumber = query.pageNumber ?? 1;
    const pageSize = query.pageSize ?? 10;
    const sortBy = query.sortBy ?? 'createdAt';
    const sortDirection = query.sortDirection ?? 'DESC';

    const posts = await this.postRepository
      .createQueryBuilder('p')
      .addSelect('COUNT(l.id)', 'likesCount')
      .leftJoin('like', 'l', 'l.postId = p.id')
      .groupBy('p.id')
      .orderBy(`p.${sortBy}`, sortDirection)
      .offset((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .getRawMany();

    return posts.map((p) => mapper(p));
  }
  async getPostsById(query: QueryPostsModel, userId: string) {
    const pageNumber = query.pageNumber ?? 1;
    const pageSize = query.pageSize ?? 10;
    const sortBy = query.sortBy ?? 'createdAt';
    const sortDirection = query.sortDirection ?? 'DESC';

    const posts = await this.postRepository
      .createQueryBuilder('p')
      .addSelect('COUNT(l.id)', 'likesCount')
      .leftJoin('like', 'l', 'l.postId = p.id')
      .where('p.userId = :userId', { userId: userId })
      .groupBy('p.id')
      .orderBy(`p.${sortBy}`, sortDirection)
      .offset((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .getRawMany();

    return posts.map((p) => mapper(p));
  }

  async getPostById(id: string) {
    return this.postRepository.findOneBy({ id: id });
  }

  async createPost(createData: PostsType): Promise<PostsViewType> {
    return this.postRepository.save(createData);
  }

  async updatePost(upData: Post) {
    return this.postRepository.save(upData);
  }
  async updateLike(likesData: any): Promise<boolean> {
    const postId = likesData.postId;
    const userId = likesData.userId;
    const like = await this.likeRepository
      .createQueryBuilder('like')
      .where('like.postId = :postId', { postId })
      .andWhere('like.userId = :userId', { userId })
      .getOne();

    if (!like) {
      await this.likeRepository.save(likesData);
      return true;
    } else {
      await this.likeRepository.delete(like.id);
    }
  }
  async deletePostById(id: string) {
    await this.postRepository.delete(id);
  }
}
