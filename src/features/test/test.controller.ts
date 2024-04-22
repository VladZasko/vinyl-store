import { Controller, Delete, Get, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../db/sql/entity/user.entity';
import { Like } from '../../db/sql/entity/like.entity';
import { TestSqlRepository } from './test.sql.repository';
import { TestMongoDbQueryRepository } from './test.mongoDb.repository';
import { Post } from '../../db/sql/entity/post.entity';

@Controller('test')
export class TestController {
  constructor(
    @Inject(TestSqlRepository) protected testRepository: TestSqlRepository,
    @Inject(TestMongoDbQueryRepository)
    protected testMongoQueryRepository: TestMongoDbQueryRepository,
  ) {}

  @Get('fillBd')
  async fillBd() {
    for (let i = 0; i < 10; i++) {
      const passwordSalt: string = await bcrypt.genSalt(10);
      const passwordHash: string = await bcrypt.hash('qwerty', passwordSalt);

      const user = new User();

      user.login = `login${i}`;
      user.email = `email${i}@gmail.com`;
      user.lastName = `lastName${i}`;
      user.firstName = `firstName${i}`;
      user.passwordHash = passwordHash;
      user.passwordSalt = passwordSalt;
      user.createdAt = new Date().toISOString();

      const newUser = await this.testRepository.createUser(user);

      const userMongo = {
        _id: newUser.id,
        login: newUser.login,
        email: newUser.email,
        lastName: newUser.lastName,
        firstName: newUser.firstName,
        createdAt: newUser.createdAt,
      };

      await this.testMongoQueryRepository.createUser(userMongo);

      for (let i = 0; i < 3; i++) {
        const post = new Post();

        post.fullName = `${newUser.lastName} ${newUser.firstName}`;
        post.title = `title${i}`;
        post.description = `description${i}`;
        post.userId = newUser.id;
        post.createdAt = new Date().toISOString();

        const newPost = await this.testRepository.createPost(post);

        const createPostMongoDb = {
          _id: newPost.id,
          createdAt: newPost.createdAt,
          fullName: newPost.fullName,
          title: newPost.title,
          description: newPost.description,
          userId: newPost.userId,
        };
        await this.testMongoQueryRepository.createPost(createPostMongoDb);

        const like = new Like();

        like.postId = newPost.id;
        like.userId = newUser.id;

        const newlike = await this.testRepository.createLike(like);

        const likeMongo = {
          _id: newlike.id,
          postId: newlike.postId,
          userId: newlike.userId,
        };
        await this.testMongoQueryRepository.createLike(likeMongo);
      }
    }
    return;
  }
  @Delete('delete-all-data')
  async deleteAllData(): Promise<void> {
    await this.testRepository.deleteAllData();

    await this.testMongoQueryRepository.deleteAllData();

    return;
  }
}
