import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDBType, UserDocument } from '../../../db/schemes/user.schemes';
import { UserViewModel } from '../model/output/UserViewModel';
import { ObjectId } from 'mongodb';
import { userMapper } from '../mapper/user.mapper';

@Injectable()
export class AuthQueryRepository {
  constructor(
    @InjectModel(UserDBType.name) private userModel: Model<UserDocument>,
  ) {}
  async getUserById(id: string): Promise<UserViewModel | null> {
    const user = await this.userModel.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return null;
    }

    return userMapper(user);
  }
}
