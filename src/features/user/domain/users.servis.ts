import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserModel } from '../models/input/CreateUserModel';
import { UserViewModel } from '../models/output/UserViewModel';
import { UserType } from '../../../memoryDb/db';
import { UpdateUserModel } from '../models/input/UpdateUserModel';
import { EmailAdapter } from '../adapters/email-adapter';
import { UsersRepository } from '../repository/user.repository';
import { userAuthMapper } from '../mapper/mappers';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { LoginAuthUserModel } from '../models/input/LoginAuthUserModel';

@Injectable()
export class UsersService {
  constructor(
    protected usersRepository: UsersRepository,
    protected emailAdapter: EmailAdapter,
    private readonly jwtService: JwtService,
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

  async checkCredentials(
    loginData: LoginAuthUserModel,
  ): Promise<UserViewModel | null> {
    const user: UserType | undefined = await this.usersRepository.findByEmail(
      loginData.email,
    );
    if (!user) {
      return null;
    }

    const passwordHash: string = await this._generateHash(
      loginData.password,
      user.passwordHash,
    );

    if (user.passwordHash !== passwordHash) {
      return null;
    }

    return userAuthMapper(user);
  }

  async _generateHash(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  async login(userId: string): Promise<string> {
    const payload: { sub: string } = { sub: userId };
    return this.jwtService.sign(payload, {
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    });
  }
}
