import { UserViewModel } from '../models/output/UserViewModel';
import { Injectable } from '@nestjs/common';
import { userAuthMapper } from '../../auth/mapper/mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../db/entity/user.entity';

@Injectable()
export class UserSqlRepository {
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

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({
      email: email,
    });
  }
}
