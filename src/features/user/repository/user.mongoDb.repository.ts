import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserDocument,
  UserMongoType,
} from '../../../db/mongoDb/schemes/user.schemes';
import { UpdateUserModel } from '../models/input/UpdateUserModel';

@Injectable()
export class UserMongoDbRepository {
  constructor(
    @InjectModel(UserMongoType.name) private userModel: Model<UserDocument>,
  ) {}
  async createUser(createData: any): Promise<boolean> {
    const user = new this.userModel(createData);
    await user.save();

    return true;
  }

  async updateUser(
    userId: string,
    updateData: UpdateUserModel,
  ): Promise<boolean> {
    await this.userModel.updateOne(
      { _id: userId },
      {
        $set: {
          firstName: updateData.firstName,
          lastName: updateData.lastName,
        },
      },
    );

    return true;
  }
}
