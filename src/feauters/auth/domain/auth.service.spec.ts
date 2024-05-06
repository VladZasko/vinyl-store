import { AuthService } from '../../../src/feauters/auth/domain/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test.util';
import { EmailAdapter } from '../../../src/adapter/email-adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDBType, UserSchema } from '../../../src/db/schemes/user.schemes';
import {
  RefreshTokenMetaDBType,
  RefreshTokenMetaSchema,
} from '../../../src/db/schemes/token.schemes';
import { AuthRepository } from '../../../src/feauters/auth/repository/auth.repository';
import { IsValidDateConstraint } from '../../../src/utils/customDecorators/date.decorator';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';

describe('integration tests for AuthService', () => {
  let authService: AuthService;
  let emailAdapter: EmailAdapter;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
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

    jest
      .spyOn(emailAdapter, 'sendCode')
      .mockImplementation(() => Promise.resolve(true));
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
      expect(result.login).toBe(newUser.login);
      expect(result.dateOfBirth).toBe(
        new Date(newUser.dateOfBirth).toISOString(),
      );
    });

    it('should return null because duplicated email', async () => {
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

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
