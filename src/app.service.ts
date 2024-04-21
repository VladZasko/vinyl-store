import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './db/entity/user.entity';
import { Repository } from 'typeorm';
import { Post } from './db/entity/post.entity';
import { Like } from './db/entity/like.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  async fillBd() {
    for (let i = 0; i < 10; i++) {
      const passwordSalt: string = await bcrypt.genSalt(10);
      const passwordHash: string = await this._generateHash(
        'qwerty',
        passwordSalt,
      );

      const user = new User();

      user.login = `login${i}`;
      user.email = `email${i}@gmail.com`;
      user.lastName = `lastName${i}`;
      user.firstName = `firstName${i}`;
      user.passwordHash = passwordHash;
      user.passwordSalt = passwordSalt;
      user.createdAt = new Date().toISOString();

      const newUser = await this.userRepository.save(user);

      for (let i = 0; i < 3; i++) {
        const post = new Post();

        post.fullName = `${newUser.lastName} ${newUser.firstName}`;
        post.title = `lastName${i}`;
        post.description = `lastName${i}`;
        post.userId = newUser.id;
        post.createdAt = new Date().toISOString();

        const newPost = await this.postRepository.save(post);

        for (let i = 0; i < 3; i++) {
          const like = new Like();

          like.postId = newPost.id;
          like.userId = newUser.id;

          await this.likeRepository.save(like);
        }
      }
    }
    return;
  }
  async _generateHash(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
