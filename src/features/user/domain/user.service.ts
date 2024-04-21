import * as bcrypt from 'bcrypt';
import { CreateUserModel } from '../models/input/CreateUserModel';
import { UserViewModel } from '../models/output/UserViewModel';
import { UpdateUserModel } from '../models/input/UpdateUserModel';
import { EmailAdapter } from '../adapter/email-adapter';
import { UserSqlRepository } from '../repository/user.sql.repository';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../../db/entity/user.entity';
import { UserMongoDbRepository } from '../repository/user.mongoDb.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserSqlRepository) protected usersRepository: UserSqlRepository,
    @Inject(UserMongoDbRepository)
    protected usersMongoDbRepository: UserMongoDbRepository,
    @Inject(EmailAdapter) protected emailAdapter: EmailAdapter,
  ) {}
  async createUser(createData: CreateUserModel): Promise<UserViewModel | null> {
    const email: User | undefined = await this.usersRepository.findByEmail(
      createData.email,
    );

    if (email) {
      return null;
    }

    const passwordSalt: string = await bcrypt.genSalt(10);
    const passwordHash: string = await this._generateHash(
      createData.password,
      passwordSalt,
    );

    const newUser = new User();

    newUser.login = createData.login;
    newUser.email = createData.email;
    newUser.lastName = createData.lastName;
    newUser.firstName = createData.firstName;
    newUser.passwordHash = passwordHash;
    newUser.passwordSalt = passwordSalt;
    newUser.createdAt = new Date().toISOString();

    const user = await this.usersRepository.createUser(newUser);

    const userMongo = {
      _id: user.id,
      login: user.login,
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName,
      createdAt: user.createdAt,
    };

    await this.usersMongoDbRepository.createUser(userMongo);

    return user;
  }

  async updateUser(
    userId: string,
    updateData: UpdateUserModel,
  ): Promise<boolean> {
    const user = await this.usersRepository.getUserById(userId);

    user.firstName = updateData.firstName;
    user.lastName = updateData.lastName;

    const updateUser = await this.usersRepository.updateUser(user);

    await this.usersMongoDbRepository.updateUser(userId, updateData);

    if (updateUser) {
      try {
        await this.emailAdapter.sendNotification(user.email, updateData);
      } catch (error) {
        console.error(error);
        return false;
      }
    }

    return true;
  }

  async _generateHash(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
