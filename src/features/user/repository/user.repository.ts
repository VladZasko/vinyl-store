import { UserViewModel } from '../models/output/UserViewModel';
import { Injectable } from '@nestjs/common';
import { userAuthMapper } from '../../auth/mapper/mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../db/entity/user.entity';
import { Post } from '../../../db/entity/post.entity';
import { Like } from '../../../db/entity/like.entity';
import { mapper } from '../mapper/mapper';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async createUser(createData: User): Promise<UserViewModel> {
    const user = await this.usersRepository.save(createData);

    return userAuthMapper(user);
  }

  async updateUser(user: User): Promise<boolean> {
    await this.usersRepository.save(user);

    return true;
  }

  async getUserById(id: string): Promise<User> {
    return this.usersRepository.findOneBy({
      id: id,
    });
  }

  async getAllUser() {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.post', 'post')
      .select('user')
      .addSelect('post')
      .where((qb) => {
        const subQb = qb
          .subQuery()
          .select('id')
          .from(Post, 'post1')
          .where('post1.userId = user.id')
          .orderBy('post1.createdAt')
          .limit(1)
          .getQuery();
        return 'post.id =' + subQb;
      })
      .leftJoin('user.likes', 'like')
      .addSelect((qb) => {
        return qb
          .select('COUNT(1)')
          .from(Like, 'like')
          .where('like.postId = post.id')
          .groupBy('like.postId');
      }, 'like')
      .getRawMany();

    return user.map((u) => mapper(u));
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({
      email: email,
    });
  }
}
