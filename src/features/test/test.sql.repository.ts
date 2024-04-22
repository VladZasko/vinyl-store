import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../db/sql/entity/user.entity';
import { PostsType } from '../post/models/PostType';
import { Post } from '../../db/sql/entity/post.entity';
import { Like } from '../../db/sql/entity/like.entity';

@Injectable()
export class TestSqlRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}
  async createUser(createData: User) {
    return await this.usersRepository.save(createData);
  }
  async createPost(createData: PostsType) {
    return this.postRepository.save(createData);
  }
  async createLike(likesData: any): Promise<Like> {
    return this.likeRepository.save(likesData);
  }

  async deleteAllData() {
    await this.likeRepository.delete({});
    await this.postRepository.delete({});
    await this.usersRepository.delete({});

    return;
  }
}
