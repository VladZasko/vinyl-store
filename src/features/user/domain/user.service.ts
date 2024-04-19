import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserModel } from '../models/input/CreateUserModel';
import { UserViewModel } from '../models/output/UserViewModel';
import { UserType } from '../../../memoryDb/db';
import { UpdateUserModel } from '../models/input/UpdateUserModel';
import { EmailAdapter } from '../adapter/email-adapter';
import { UserRepository } from '../repository/user.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository) protected usersRepository: UserRepository,
    @Inject(EmailAdapter) protected emailAdapter: EmailAdapter,
  ) {}
  async createUser(createData: CreateUserModel): Promise<UserViewModel | null> {
    const email: UserType | undefined = await this.usersRepository.findByEmail(
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

    const newUser: UserType = {
      userId: uuidv4(),
      login: createData.login,
      email: createData.email,
      lastName: createData.lastName,
      firstName: createData.firstName,
      createdAt: new Date().toISOString(),
      passwordHash,
      passwordSalt,
    };

    return await this.usersRepository.createUser(newUser);
  }

  async updateUser(
    user: UserViewModel,
    updateData: UpdateUserModel,
  ): Promise<boolean> {
    await this.usersRepository.updateUser(user, updateData);

    if (updateData) {
      try {
        await this.emailAdapter.sendNotification(user, updateData);
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
