import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ReviewDBType,
  ReviewDocument,
} from '../../../db/schemes/review.schemes';
import { ObjectId } from 'mongodb';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectModel(ReviewDBType.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async deleteReview(id: string): Promise<boolean> {
    const deleteReview = await this.reviewModel.deleteOne({
      _id: new ObjectId(id),
    });

    return !!deleteReview.deletedCount;
  }
}
