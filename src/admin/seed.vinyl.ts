import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { vinylTestData } from './vinyl.test.data';
import { VinylDBType, VinylDocument } from '../db/schemes/vinyl.shemes';

@Injectable()
export class SeedVinyl {
  constructor(
    private configService: ConfigService,
    @InjectModel(VinylDBType.name) private vinylModel: Model<VinylDocument>,
  ) {}

  @Command({
    command: 'seed:vinyl',
    describe: 'create a vinyl',
  })
  async create() {
    for (let i = 1; i <= Object.keys(vinylTestData).length; i++) {
      await this.vinylModel.create({
        createdAt: new Date().toISOString(),
        ...vinylTestData[`${i}`],
      });
    }
  }
}
