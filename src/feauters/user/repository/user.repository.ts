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

  async updatePassword(user: any, salt: string, hash: string) {
    const result = await this.userModel.updateOne(
      { _id: new ObjectId(user.id) },
      {
        $set: {
          'accountData.passwordHash': hash,
          'accountData.passwordSalt': salt,
        },
        $unset: {
          passwordRecovery: 1,
        },
      },
    );
    return result.modifiedCount === 1;
  }

  async passwordRecovery(
    _id: ObjectId,
    passwordRecoveryCode: string,
    expirationDate: Date,
  ) {
    const result = await this.userModel.updateOne(
      { _id },
      {
        $set: {
          'passwordRecovery.recoveryCode': passwordRecoveryCode,
          'passwordRecovery.expirationDate': expirationDate,
        },
      },
    );

    return result.modifiedCount === 1;
  }

  async createRefreshTokensMeta(refreshTokenDto: any) {
    return this.refreshTokenMetaModel.insertMany(refreshTokenDto);
  }
  async updateRefreshTokensMeta(refreshTokenDto: any) {
    return this.refreshTokenMetaModel.updateOne(
      { deviceId: refreshTokenDto.deviceId },
      {
        $set: {
          issuedAt: refreshTokenDto.issuedAt,
          userId: refreshTokenDto.userId,
          deviseName: refreshTokenDto.deviseName,
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

  async findUserByRecoveryCode(recoveryCode: string) {
    return this.userModel.findOne({
      'passwordRecovery.recoveryCode': recoveryCode,
    });
  }
  async findByEmail(email: string) {
    return this.userModel.findOne({
      'accountData.email': email,
    });
  }
}
