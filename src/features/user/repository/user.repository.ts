import { db, UserType } from '../../../memoryDb/db';
import { UserViewModel } from '../models/output/UserViewModel';
import { UpdateUserModel } from '../models/input/UpdateUserModel';
import { userAuthMapper } from '../mapper/mappers';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  async createUser(createData: UserType): Promise<UserViewModel> {
    db.users.push(createData);

    return {
      userId: createData.userId,
      login: createData.login,
      email: createData.email,
      firstName: createData.firstName,
      lastName: createData.lastName,
      createdAt: createData.createdAt,
    };
  }

  async updateUser(
    user: UserViewModel,
    updateData: UpdateUserModel,
  ): Promise<boolean> {
    const updateUser: UserType | undefined = db.users.find(
      (c: UserType) => c.userId === user.userId,
    );

    if (!updateUser) {
      return false;
    }

    updateUser.lastName = updateData.lastName;
    updateUser.firstName = updateData.firstName;

    return true;
  }

  async getUserById(id: string): Promise<UserViewModel | null> {
    const user: UserType | undefined = db.users.find(
      (v: UserType) => v.userId === id,
    );

    if (!user) {
      return null;
    }

    return userAuthMapper(user);
  }

  async findByEmail(email: string): Promise<UserType> {
    return db.users.find((v: UserType) => v.email === email);
  }
}
