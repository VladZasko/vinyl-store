import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../../test/test.util';
import { EmailAdapter } from '../../../adapter/email-adapter';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserDBType,
  UserDocument,
  UserSchema,
} from '../../../db/schemes/user.schemes';
import {
  RefreshTokenMetaDBType,
  RefreshTokenMetaDocument,
  RefreshTokenMetaSchema,
} from '../../../db/schemes/token.schemes';
import { AuthRepository } from '../repository/auth.repository';
import { IsValidDateConstraint } from '../../../utils/customDecorators/date.decorator';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { addMinutes } from 'date-fns';
import { add } from 'date-fns/add';
import { Model } from 'mongoose';
import * as moment from 'moment';

describe('integration tests for AuthService', () => {
  let authService: AuthService;
  let emailAdapter: EmailAdapter;
  let UserModel: Model<UserDocument>;
  let RefreshTokenMetaModel: Model<RefreshTokenMetaDocument>;
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
          {
            name: RefreshTokenMetaDBType.name,
            schema: RefreshTokenMetaSchema,
          },
        ]),
      ],
      providers: [
        AuthService,
        AuthRepository,
        EmailAdapter,
        IsValidDateConstraint,
        JwtService,
      ],
    }).compile();

    authService = moduleFixture.get<AuthService>(AuthService);
    emailAdapter = moduleFixture.get<EmailAdapter>(EmailAdapter);
    UserModel = moduleFixture.get<Model<UserDocument>>(
      `${UserDBType.name}Model`,
    );
    RefreshTokenMetaModel = moduleFixture.get<Model<RefreshTokenMetaDocument>>(
      `${RefreshTokenMetaDBType.name}Model`,
    );

    jest
      .spyOn(emailAdapter, 'sendCode')
      .mockImplementation(() => Promise.resolve(true));
    jest
      .spyOn(emailAdapter, 'sendNewCode')
      .mockImplementation(() => Promise.resolve(true));
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await RefreshTokenMetaModel.deleteMany({});
  });

  describe('createUser', () => {
    it('this.emailAdapter.sendCode should be called ', async () => {
      const newUser = {
        login: 'TestLogin1',
        lastName: 'TestLastName',
        firstName: 'TestFirstName',
        email: 'testemail1@meil.com',
        dateOfBirth: '1996-05-14',
        password: 'qwerty',
      };

      await authService.createUser(newUser);

      expect(emailAdapter.sendCode).toBeCalled();
    });

    it('should return correct created user', async () => {
      const newUser = {
        login: 'TestLogin',
        lastName: 'TestLastName',
        firstName: 'TestFirstName',
        email: 'testemail@meil.com',
        dateOfBirth: '1996-05-14',
        password: 'qwerty',
      };
      const result = await authService.createUser(newUser);
      expect(result.email).toBe(newUser.email);
      expect(result.dateOfBirth).toBe(
        moment(newUser.dateOfBirth).format('MM/DD/YYYY'),
      );
    });

    it('should return error because duplicated email', async () => {
      const newUser = {
        login: 'TestLogin',
        lastName: 'TestLastName',
        firstName: 'TestFirstName',
        email: 'testemail@meil.com',
        dateOfBirth: '1996-05-14',
        password: 'qwerty',
      };

      try {
        await authService.createUser(newUser);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('User with this email already exists');
      }
    });
  });

  describe('confirmEmail', () => {
    const createUser = (
      confirmationCode: string,
      expirationDate: string,
      isConfirmed: boolean,
    ) => {
      return {
        accountData: {
          lastName: 'TestLastName',
          firstName: 'TestFirstName',
          dateOfBirth: '1996-05-14',
          email: 'testemail@meil.com',
          createdAt: new Date().toISOString(),
          avatar: 'string',
          role: 'string',
        },
        emailConfirmation: {
          confirmationCode: confirmationCode,
          expirationDate: expirationDate,
          isConfirmed: isConfirmed,
        },
      };
    };
    it('should return false for expired confirmation code ', async () => {
      await UserModel.create(
        createUser('testcode', addMinutes(new Date(), -1).toISOString(), false),
      );

      const result = await authService.confirmEmail('testcode');

      expect(result).toBeFalsy();
    });

    it('should return false for not existed confirmation code', async () => {
      const result = await authService.confirmEmail('notexistedtestcode');

      expect(result).toBeFalsy();
    });

    it('should return true for existing and not expired confirmation code', async () => {
      await UserModel.create(
        createUser(
          'goodcode',
          add(new Date(), {
            minutes: 15,
          }).toISOString(),
          false,
        ),
      );

      const result = await authService.confirmEmail('goodcode');

      expect(result).toBeTruthy();
    });

    it('should return false if email has already been confirmed', async () => {
      await UserModel.create(
        createUser(
          'goodcode',
          add(new Date(), {
            minutes: 15,
          }).toISOString(),
          false,
        ),
      );

      await authService.confirmEmail('goodcode');
      const result = await authService.confirmEmail('goodcode');

      expect(result).toBeFalsy();
    });
  });

  describe('resendingConfirmationCode', () => {
    const createUser = (
      confirmationCode: string,
      expirationDate: string,
      isConfirmed: boolean,
    ) => {
      return {
        accountData: {
          login: 'TestLogin',
          lastName: 'TestLastName',
          firstName: 'TestFirstName',
          dateOfBirth: '1996-05-14',
          email: 'testemail@meil.com',
          createdAt: new Date().toISOString(),
          avatar: 'string',
          role: 'string',
        },
        emailConfirmation: {
          confirmationCode: confirmationCode,
          expirationDate: expirationDate,
          isConfirmed: isConfirmed,
        },
      };
    };

    it('this.emailAdapter.sendNewCode should be called ', async () => {
      const newUser = {
        login: 'TestLogin1',
        lastName: 'TestLastName',
        firstName: 'TestFirstName',
        email: 'testemail1@meil.com',
        dateOfBirth: '1996-05-14',
        password: 'qwerty',
      };

      await authService.createUser(newUser);
      await authService.resendingConfirmationCode(newUser.email);

      expect(emailAdapter.sendNewCode).toBeCalled();
    });

    it('should return false for non-existent user', async () => {
      const result = await authService.resendingConfirmationCode(
        'testemail2@meil.com',
      );

      expect(result).toBeFalsy();
    });

    it('should return false for already confirmed user', async () => {
      await UserModel.create(
        createUser(
          'goodcode',
          add(new Date(), {
            minutes: 15,
          }).toISOString(),
          false,
        ),
      );

      await authService.confirmEmail('goodcode');
      const result = await authService.confirmEmail('goodcode');

      expect(result).toBeFalsy();
    });
  });

  describe('signIn', () => {
    const createUser = (email: string) => {
      return {
        provider: 'google',
        providerId: 'testid',
        email: email,
        firstName: 'testFirstName',
        lastName: 'testLastName',
      };
    };
    it('should return error if there is no user', async () => {
      try {
        await authService.signIn(null);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Unauthenticated');
      }
    });

    it('should return access and refresh tokens if email already exists', async () => {
      await authService.signIn(createUser('testEmail@meil.com'));
      const result = await authService.signIn(createUser('testEmail@meil.com'));
      const refreshTokenMeta = await RefreshTokenMetaModel.find({});

      expect(refreshTokenMeta.length).toBe(1);
      expect(result).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    it('should create new user if email not exist', async () => {
      const result = await authService.signIn(createUser('testEmail@meil.com'));
      const refreshTokenMeta = await RefreshTokenMetaModel.find({});

      expect(refreshTokenMeta.length).toBe(1);
      expect(result).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });
  });

  describe('createUserFromGoogle', () => {
    const createUser = (email: string) => {
      return {
        provider: 'google',
        providerId: 'testid',
        email: email,
        firstName: 'testFirstName',
        lastName: 'testLastName',
      };
    };

    it('should create user, return tokens on success', async () => {
      const result = await authService.createUserFromGoogle(
        createUser('testEmail@meil.com'),
      );

      const findUser = await UserModel.find({}).lean();

      expect(findUser.length).toBe(1);
      expect(result).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });
  });

  describe('checkCredentials', () => {
    it('should return user on successful credential check', async () => {
      const newUser = {
        login: 'TestLogin1',
        lastName: 'TestLastName',
        firstName: 'TestFirstName',
        email: 'testemail1@meil.com',
        dateOfBirth: '1996-05-14',
        password: 'qwerty',
      };

      await authService.createUser(newUser);

      const credentials = {
        email: 'testemail1@meil.com',
        password: 'qwerty',
      };

      const user = await authService.checkCredentials(credentials);

      expect(user).not.toBeNull();
      expect(user.email).toBe(newUser.email);
      expect(user.firstName).toBe(newUser.firstName);
    });

    it('should return null for non-existent user', async () => {
      const credentials = {
        email: 'testemail1@meil.com',
        password: 'qwerty',
      };
      const user = await authService.checkCredentials(credentials);

      expect(user).toBeNull();
    });

    it('should return true for existing and not expired confirmation code', async () => {
      const newUser = {
        login: 'TestLogin1',
        lastName: 'TestLastName',
        firstName: 'TestFirstName',
        email: 'testemail1@meil.com',
        dateOfBirth: '1996-05-14',
        password: 'qwerty',
      };

      await authService.createUser(newUser);

      const credentials = {
        email: 'testemail1@meil.com',
        password: 'incorrect',
      };

      const user = await authService.checkCredentials(credentials);

      expect(user).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('should refresh token on valid data', async () => {
      const dataRefreshToken = {
        userId: 'user-id',
        deviseName: 'device-name',
        issuedAt: new Date().toISOString(),
      };

      const refreshToken = await authService.refreshToken(dataRefreshToken);

      expect(refreshToken).toEqual(expect.any(String));
    });
  });

  describe('createRefreshTokensMeta', () => {
    it('should create refresh token meta on new record', async () => {
      const dataRefreshToken = {
        userId: 'user-id',
        deviseName: 'device-name',
        issuedAt: new Date().toISOString(),
      };
      const emptyRefreshTokenMetaCollection = await RefreshTokenMetaModel.find(
        {},
      );

      const refreshTokenMeta =
        await authService.createRefreshTokensMeta(dataRefreshToken);

      const findRefreshTokenMetaCollection = await RefreshTokenMetaModel.find(
        {},
      );

      expect(emptyRefreshTokenMetaCollection.length).toBe(0);
      expect(findRefreshTokenMetaCollection.length).toBe(1);
      expect(refreshTokenMeta.userId).toBe(dataRefreshToken.userId);
    });

    it('should update refresh token meta on existing record', async () => {
      const dataRefreshToken = {
        userId: 'user-id',
        deviseName: 'device-name',
        issuedAt: new Date().toISOString(),
      };
      const refreshTokenMeta =
        await authService.createRefreshTokensMeta(dataRefreshToken);

      const findRefreshTokenMetaCollection = await RefreshTokenMetaModel.find(
        {},
      );

      await authService.createRefreshTokensMeta(dataRefreshToken);

      const updateRefreshTokenMetaCollection = await RefreshTokenMetaModel.find(
        {},
      );

      expect(findRefreshTokenMetaCollection.length).toBe(1);
      expect(updateRefreshTokenMetaCollection.length).toBe(1);
      expect(refreshTokenMeta.userId).toBe(dataRefreshToken.userId);
    });
  });

  describe('deleteRefreshTokensMeta', () => {
    it('should delete refresh token meta', async () => {
      const dataRefreshToken = {
        userId: 'user-id',
        deviseName: 'device-name',
        issuedAt: new Date().toISOString(),
      };

      const refreshTokenMeta =
        await authService.createRefreshTokensMeta(dataRefreshToken);

      const findRefreshTokenMetaCollection = await RefreshTokenMetaModel.find(
        {},
      );

      await authService.deleteRefreshTokensMeta(refreshTokenMeta.userId);

      const emptyRefreshTokenMetaCollection = await RefreshTokenMetaModel.find(
        {},
      );

      expect(findRefreshTokenMetaCollection.length).toBe(1);
      expect(emptyRefreshTokenMetaCollection.length).toBe(0);
      expect(refreshTokenMeta.userId).toBe(dataRefreshToken.userId);
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
