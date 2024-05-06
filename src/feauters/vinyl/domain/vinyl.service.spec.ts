import { Model } from 'mongoose';
import {
  UserDBType,
  UserDocument,
  UserSchema,
} from '../../../db/schemes/user.schemes';
import {
  ReviewDBType,
  ReviewDocument,
  ReviewSchema,
} from '../../../db/schemes/review.schemes';
import {
  VinylDBType,
  VinylDocument,
  VinylSchema,
} from '../../../db/schemes/vinyl.shemes';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../../test/test.util';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from '../../user/repository/user.repository';
import {
  OrderDBType,
  OrderDocument,
  OrderSchema,
} from '../../../db/schemes/order.schemes';
import { VinylService } from './vinyl.service';
import { VinylRepository } from '../repository/vinyl.repository';
import { StripeAdapter } from '../../stripe/stripe.adapter';
import { EmailAdapter } from '../../../adapter/email-adapter';
import { TelegramAdapter } from '../../../adapter/telegram.adapter';
import { ObjectId } from 'mongodb';
import { NotFoundException } from '@nestjs/common';

describe('integration tests for VinylService', () => {
  let vinylService: VinylService;
  let telegramAdapter: TelegramAdapter;
  let stripeAdapter: StripeAdapter;
  let emailAdapter: EmailAdapter;
  let UserModel: Model<UserDocument>;
  let ReviewModel: Model<ReviewDocument>;
  let VinylModel: Model<VinylDocument>;
  let OrderModel: Model<OrderDocument>;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: VinylDBType.name,
            schema: VinylSchema,
          },
          {
            name: ReviewDBType.name,
            schema: ReviewSchema,
          },
          {
            name: UserDBType.name,
            schema: UserSchema,
          },
          {
            name: OrderDBType.name,
            schema: OrderSchema,
          },
        ]),
      ],
      providers: [
        VinylService,
        VinylRepository,
        UserRepository,
        StripeAdapter,
        EmailAdapter,
        TelegramAdapter,
      ],
    }).compile();

    vinylService = moduleFixture.get<VinylService>(VinylService);
    telegramAdapter = moduleFixture.get<TelegramAdapter>(TelegramAdapter);
    stripeAdapter = moduleFixture.get<StripeAdapter>(StripeAdapter);
    emailAdapter = moduleFixture.get<EmailAdapter>(EmailAdapter);

    UserModel = moduleFixture.get<Model<UserDocument>>(
      `${UserDBType.name}Model`,
    );
    ReviewModel = moduleFixture.get<Model<ReviewDocument>>(
      `${ReviewDBType.name}Model`,
    );
    VinylModel = moduleFixture.get<Model<VinylDocument>>(
      `${VinylDBType.name}Model`,
    );
    OrderModel = moduleFixture.get<Model<OrderDocument>>(
      `${OrderDBType.name}Model`,
    );

    jest
      .spyOn(telegramAdapter, 'sendMessage')
      .mockImplementation(() => Promise.resolve());
    jest
      .spyOn(stripeAdapter, 'buy')
      .mockImplementation(() => Promise.resolve({ url: 'anyUrl' }));
    jest
      .spyOn(emailAdapter, 'sendNotificationByVinyl')
      .mockImplementation(() => Promise.resolve(true));
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await ReviewModel.deleteMany({});
    await VinylModel.deleteMany({});
  });

  describe('createVinyl', () => {
    const newVinyl = {
      title: 'Test Vinyl',
      author: 'Test Artist',
      description: 'This is a test vinyl',
      price: 10,
      quantity: 10,
    };
    it('should create vinyl and send notification on success', async () => {
      const createVinyl = await vinylService.createVinyl(newVinyl);

      const findVinyl = await VinylModel.findById({
        _id: new ObjectId(createVinyl.id),
      }).lean();

      expect(findVinyl).toEqual({
        _id: expect.any(ObjectId),
        __v: 0,
        createdAt: expect.any(String),
        ...newVinyl,
      });
      expect(telegramAdapter.sendMessage).toBeCalled();
    });
  });

  describe('buyVinyl', () => {
    const newVinyl = {
      title: 'Test Vinyl',
      author: 'Test Artist',
      description: 'This is a test vinyl',
      createdAt: new Date().toISOString(),
      price: 10,
      quantity: 10,
    };

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
    it('should create order and call stripe adapter on success', async () => {
      const createUser = await UserModel.create(newUser);
      const createVinyl = await VinylModel.create(newVinyl);

      const buyVinyl = await vinylService.buyVinyl(
        createUser._id.toString(),
        createVinyl,
      );

      const findOrder = await OrderModel.findOne({
        vinylId: createVinyl._id.toString(),
      }).lean();

      expect(findOrder.userId).toBe(createUser._id.toString());
      expect(findOrder.price).toBe(createVinyl.price);
      expect(buyVinyl).toEqual({ url: expect.any(String) });
      expect(stripeAdapter.buy).toBeCalled();
    });
  });

  describe('finishBuyVinyl', () => {
    const newVinyl = {
      title: 'Test Vinyl',
      author: 'Test Artist',
      description: 'This is a test vinyl',
      createdAt: new Date().toISOString(),
      price: 10,
      quantity: 10,
    };

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
    it('should finish buy successfully and send notification', async () => {
      const createUser = await UserModel.create(newUser);
      const createVinyl = await VinylModel.create(newVinyl);

      const orderData = {
        userId: createUser._id.toString(),
        vinylId: createVinyl._id.toString(),
        price: newVinyl.price,
        createdAt: new Date().toISOString(),
      };

      const createOrder = await OrderModel.create(orderData);

      const finishBuy = await vinylService.finishBuyVinyl(
        createOrder._id.toString(),
      );
      const findVinyl = await VinylModel.findById(
        createVinyl._id.toString(),
      ).lean();
      const findUser = await UserModel.findById(
        createUser._id.toString(),
      ).lean();

      expect(finishBuy).toBeTruthy();
      expect(findVinyl.quantity).toBe(createVinyl.quantity - 1);
      expect(emailAdapter.sendNotificationByVinyl).toBeCalled();
      expect(findUser.purchasedVinyl[0]).toEqual({
        vinylId: createVinyl._id.toString(),
        purchasedDate: expect.any(String),
      });
    });
    it('should throw error on order not found', async () => {
      try {
        await vinylService.finishBuyVinyl(new ObjectId().toString());
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Order not found');
      }
    });
  });

  describe('updateVinyl', () => {
    const newVinyl = {
      title: 'Test Vinyl',
      author: 'Test Artist',
      description: 'This is a test vinyl',
      createdAt: new Date().toISOString(),
      price: 10,
      quantity: 10,
    };

    it('should update vinyl successfully', async () => {
      const createVinyl = await VinylModel.create(newVinyl);

      const upData = {
        title: 'update title',
        author: 'update author',
        description: 'update description',
        price: 100,
        quantity: 5,
      };

      const updateVinyl = await vinylService.updateVinyl(
        createVinyl._id.toString(),
        upData,
      );

      const findVinyl = await VinylModel.findById(
        createVinyl._id.toString(),
      ).lean();

      expect(updateVinyl).toBeTruthy();
      expect(findVinyl).toEqual({
        _id: createVinyl._id,
        __v: 0,
        createdAt: expect.any(String),
        ...upData,
      });
    });
  });

  describe('createReviewByVinyl', () => {
    const newVinyl = {
      title: 'Test Vinyl',
      author: 'Test Artist',
      description: 'This is a test vinyl',
      createdAt: new Date().toISOString(),
      price: 10,
      quantity: 10,
    };

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
    it('should create review successfully', async () => {
      const createUser = await UserModel.create(newUser);
      const createVinyl = await VinylModel.create(newVinyl);

      const createReviewData = {
        content: 'Test content',
        score: 5,
        vinylId: createVinyl._id.toString(),
      };

      const createReview = await vinylService.createReviewByVinyl(
        createUser._id.toString(),
        createReviewData,
      );
      const findReview = await ReviewModel.findOne({
        vinylId: createVinyl._id.toString(),
      }).lean();

      expect(createReview).toBeTruthy();
      expect(findReview).toEqual({
        _id: expect.any(ObjectId),
        __v: 0,
        createdAt: expect.any(String),
        author: `${createUser.accountData.firstName!} ${createUser.accountData.lastName!}`,
        userId: createUser._id.toString(),
        ...createReviewData,
      });
    });
    it('should return null on user not found', async () => {
      const createReviewData = {
        content: 'Test content',
        score: 5,
        vinylId: 'testId',
      };
      try {
        await vinylService.createReviewByVinyl(
          new ObjectId().toString(),
          createReviewData,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('User not found');
      }
    });
  });

  describe('deleteVinyl', () => {
    const newVinyl = {
      title: 'Test Vinyl',
      author: 'Test Artist',
      description: 'This is a test vinyl',
      createdAt: new Date().toISOString(),
      price: 10,
      quantity: 10,
    };
    it('should delete user', async () => {
      const createVinyl = await VinylModel.create(newVinyl);

      const deleteVinyl = await vinylService.deleteVinyl(
        createVinyl._id.toString(),
      );
      const findVinyl = await VinylModel.findById(createVinyl._id).lean();

      expect(deleteVinyl).toBeTruthy();
      expect(findVinyl).toBeNull();
    });
  });
  afterAll(async () => {
    await closeInMongodConnection();
  });
});
