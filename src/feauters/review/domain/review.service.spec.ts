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
import { ReviewService } from './review.service';
import { ReviewRepository } from '../repository/review.repository';

describe('integration tests for ReviewService', () => {
  let reviewService: ReviewService;
  let UserModel: Model<UserDocument>;
  let ReviewModel: Model<ReviewDocument>;
  let VinylModel: Model<VinylDocument>;
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
        ]),
      ],
      providers: [ReviewService, ReviewRepository],
    }).compile();

    reviewService = moduleFixture.get<ReviewService>(ReviewService);

    UserModel = moduleFixture.get<Model<UserDocument>>(
      `${UserDBType.name}Model`,
    );
    ReviewModel = moduleFixture.get<Model<ReviewDocument>>(
      `${ReviewDBType.name}Model`,
    );
    VinylModel = moduleFixture.get<Model<VinylDocument>>(
      `${VinylDBType.name}Model`,
    );
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await ReviewModel.deleteMany({});
    await VinylModel.deleteMany({});
  });

  describe('deleteReview', () => {
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
    it('should delete review', async () => {
      const createUser = await UserModel.create(newUser);
      const createVinyl = await VinylModel.create(newVinyl);

      const newReview = {
        author: `${createUser.accountData.firstName!} ${createUser.accountData.lastName!}`,
        content: 'Test content',
        score: 5,
        vinylId: createVinyl._id.toString(),
        userId: createUser._id.toString(),
        createdAt: new Date().toISOString(),
      };

      const createReview = await ReviewModel.create(newReview);

      const deleteReview = await reviewService.deleteReview(
        createReview._id.toString(),
      );
      const findReview = await ReviewModel.findById(createReview._id).lean();

      expect(deleteReview).toBeTruthy();
      expect(findReview).toBeNull();
    });
  });
  afterAll(async () => {
    await closeInMongodConnection();
  });
});
