import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../../test/test.util';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserDBType,
  UserDocument,
  UserSchema,
} from '../../../db/schemes/user.schemes';
import { Model } from 'mongoose';
import { UserService } from './user.service';
import { UserRepository } from '../repository/user.repository';
import { StorageService } from '../../storage/storage.service';
import { ConfigService } from '@nestjs/config';

describe('integration tests for UserService', () => {
  let userService: UserService;
  let UserModel: Model<UserDocument>;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: UserDBType.name,
            schema: UserSchema,
          },
        ]),
      ],
      providers: [UserService, UserRepository, StorageService, ConfigService],
    }).compile();

    userService = moduleFixture.get<UserService>(UserService);
    UserModel = moduleFixture.get<Model<UserDocument>>(
      `${UserDBType.name}Model`,
    );
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  describe('updateUser', () => {
    const newUser = {
      accountData: {
        lastName: 'TestLastName',
        firstName: 'TestFirstName',
        dateOfBirth: '1996-05-14',
        email: 'testemail@meil.com',
        createdAt: new Date().toISOString(),
        avatar: 'string',
        role: 'string',
      },
    };
    it('should update user successfully', async () => {
      const createUser = await UserModel.create(newUser);

      const upData = {
        lastName: 'UpLastName',
        firstName: 'UpFirstName',
        dateOfBirth: '1996-04-14',
      };

      const updateUser = await userService.updateUser(
        createUser._id.toString(),
        upData,
      );
      const findUpUser = await UserModel.findById(createUser._id).lean();

      expect(updateUser).toBeTruthy();
      expect(findUpUser.accountData.lastName).toBe(upData.lastName);
      expect(findUpUser.accountData.firstName).toBe(upData.firstName);
      expect(findUpUser.accountData.dateOfBirth).toBe(
        new Date(upData.dateOfBirth).toISOString(),
      );
    });
  });

  describe('deleteUserById', () => {
    const newUser = {
      accountData: {
        lastName: 'TestLastName',
        firstName: 'TestFirstName',
        dateOfBirth: '1996-05-14',
        email: 'testemail@meil.com',
        createdAt: new Date().toISOString(),
        avatar: 'string',
        role: 'string',
      },
    };
    it('should delete user', async () => {
      const createUser = await UserModel.create(newUser);

      const deleteUser = await userService.deleteUserById(
        createUser._id.toString(),
      );
      const findUser = await UserModel.findById(createUser._id).lean();

      expect(deleteUser).toBeTruthy();
      expect(findUser).toBeNull();
    });
  });
  afterAll(async () => {
    await closeInMongodConnection();
  });
});
