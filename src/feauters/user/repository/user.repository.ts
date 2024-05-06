import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDBType, UserDocument } from '../../../db/schemes/user.schemes';
import { ObjectId } from 'mongodb';
import { UpdateUserModel } from '../model/input/UpdateUserModel';
import { CreateUserDto } from '../../auth/model/dto/CreateUserDto';
import { userMapper } from '../../auth/mapper/user.mapper';
import { UserViewModel } from '../../auth/model/output/UserViewModel';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserDBType.name) private userModel: Model<UserDocument>,
    // @InjectModel(UserArchiveDBType.name)
    // private userArchiveModel: Model<UserArchiveDocument>,
  ) {}

  async updateUser(userId: string, updateData: UpdateUserModel) {
    const updateUser = await this.userModel.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          'accountData.lastName': updateData.lastName,
          'accountData.firstName': updateData.firstName,
          'accountData.dateOfBirth': updateData.dateOfBirth,
        },
      },
    );
    return !!updateUser.matchedCount;
  }

  async updateAvatar(userId: string, updateData: string) {
    const updateUser = await this.userModel.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          'accountData.avatar': updateData,
        },
      },
    );
    return !!updateUser.matchedCount;
  }

  async findUserById(id: string): Promise<UserViewModel> {
    const findUser = await this.userModel.findOne({
      _id: new ObjectId(id),
    });

    if (!findUser) {
      return null;
    }

    return userMapper(findUser);
  }

  async archiveUser(createData: CreateUserDto): Promise<boolean> {
    await this.userModel.create({ ...createData });

    return true;
  }

  async deleteUserById(id: string): Promise<boolean> {
    const deleteUser = await this.userModel.deleteOne({
      _id: new ObjectId(id),
    });

    return !!deleteUser.deletedCount;
  }
}
