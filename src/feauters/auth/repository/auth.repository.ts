import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDBType, UserDocument } from '../../../db/schemes/user.schemes';
import {
  RefreshTokenMetaDBType,
  RefreshTokenMetaDocument,
} from '../../../db/schemes/token.schemes';
import { ObjectId } from 'mongodb';
import { CreateUserDto } from '../model/dto/CreateUserDto';
import { UserViewModel } from '../model/output/UserViewModel';
import { userMapper } from '../mapper/user.mapper';
import { RefreshTokenDto } from '../model/dto/RefreshTokenDto';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(UserDBType.name) private userModel: Model<UserDocument>,
    @InjectModel(RefreshTokenMetaDBType.name)
    private refreshTokenMetaModel: Model<RefreshTokenMetaDocument>,
  ) {}

  async createUser(createData: CreateUserDto): Promise<UserViewModel> {
    const user = await this.userModel.create({ ...createData });

    return userMapper(user);
  }

  async updateConfirmation(_id: ObjectId) {
    const result = await this.userModel.updateOne(
      { _id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    );
    return result.modifiedCount === 1;
  }

  async newConfirmationCode(
    _id: ObjectId,
    data: Date,
    newConfirmationCode: string,
  ) {
    const result = await this.userModel.updateOne(
      { _id },
      {
        $set: {
          'emailConfirmation.confirmationCode': newConfirmationCode,
          'emailConfirmation.expirationDate': data,
        },
      },
    );

    return result.modifiedCount === 1;
  }

  async findRefreshTokensMeta(userId: string) {
    return this.refreshTokenMetaModel.findOne({
      userId,
    });
  }
  async createRefreshTokensMeta(dataRefreshToken: RefreshTokenDto) {
    return this.refreshTokenMetaModel.create(dataRefreshToken);
  }
  async updateRefreshTokensMeta(dataRefreshToken: RefreshTokenDto) {
    return this.refreshTokenMetaModel.updateOne(
      { userId: dataRefreshToken.userId },
      {
        $set: {
          issuedAt: dataRefreshToken.issuedAt,
          deviseName: dataRefreshToken.deviseName,
        },
      },
    );
  }

  async deleteRefreshTokensMeta(userId: string) {
    return this.refreshTokenMetaModel.deleteOne({ userId });
  }

  async findUserByConfirmationCode(emailConfirmationCode: string) {
    return this.userModel.findOne({
      'emailConfirmation.confirmationCode': emailConfirmationCode,
    });
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({
      'accountData.email': email,
    });
  }

  async findUserById(id: string) {
    const user = await this.userModel.findOne({ _id: new ObjectId(id) });

    return user;
  }
}
