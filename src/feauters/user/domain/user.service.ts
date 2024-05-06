import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { UpdateUserModel } from '../model/input/UpdateUserModel';
import { ConfigService } from '@nestjs/config';
import { StorageService } from '../../storage/storage.service';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Injectable()
export class UserService {
  constructor(
    protected userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly storage: StorageService,
  ) {}

  async updateUser(
    userId: string,
    updateData: UpdateUserModel,
  ): Promise<boolean> {
    const upData = {
      ...updateData,
      dateOfBirth: new Date(updateData.dateOfBirth).toISOString(),
    };
    return this.userRepository.updateUser(userId, upData);
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const bucket = this.configService.get('aws.s3Bucket');
    const fileName: string = `${uuidv4()}${userId}${extname(file.originalname)}`;
    const key: string = `avatar/${fileName}`;

    const uploadAvatar = await this.storage.uploadFile(
      bucket,
      key,
      file.buffer,
    );

    await this.userRepository.updateAvatar(userId, uploadAvatar.Location);

    return;
  }

  async deleteUserById(id: string): Promise<boolean> {
    return await this.userRepository.deleteUserById(id);
  }
}
