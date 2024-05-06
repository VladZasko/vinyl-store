import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../../test/test.util';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SystemLogsDBType,
  SystemLogsDocument,
  SystemLogsSchema,
} from '../../../db/schemes/system.logs.schemes';
import { SystemLogsService } from './system.logs.service';
import { SystemLogsRepository } from '../repository/system.logs.remository';
import { ObjectId } from 'mongodb';
import { Actions, Entity } from '../model/dto/AddLogsDto';

describe('integration tests for SystemLogsService', () => {
  let systemLogsService: SystemLogsService;
  let SystemLogsModel: Model<SystemLogsDocument>;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: SystemLogsDBType.name,
            schema: SystemLogsSchema,
          },
        ]),
      ],
      providers: [SystemLogsService, SystemLogsRepository],
    }).compile();

    systemLogsService = moduleFixture.get<SystemLogsService>(SystemLogsService);

    SystemLogsModel = moduleFixture.get<Model<SystemLogsDocument>>(
      `${SystemLogsDBType.name}Model`,
    );
  });

  beforeEach(async () => {
    await SystemLogsModel.deleteMany({});
  });

  describe('addLogs', () => {
    it('should create Logs', async () => {
      const newLogs = {
        actions: Actions.Create,
        entity: Entity.User,
        userId: new ObjectId().toString(),
      };

      const addLogs = await systemLogsService.addLogs(newLogs);

      const findLogs = await SystemLogsModel.findOne({
        userId: new ObjectId(newLogs.userId),
      }).lean();

      expect(addLogs).toBeTruthy();
      expect(findLogs).toEqual({
        _id: expect.any(ObjectId),
        __v: 0,
        createdAt: expect.any(String),
        ...newLogs,
      });
    });
  });
  afterAll(async () => {
    await closeInMongodConnection();
  });
});
