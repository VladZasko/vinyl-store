import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDBType, UserDocument } from '../../../db/schemes/user.schemes';
import { ObjectId } from 'mongodb';
import { userProfileMapper } from '../mapper/user.mapper';
import { UserProfileViewModel } from '../model/output/UserProfileViewModel';
import {
  ReviewDBType,
  ReviewDocument,
} from '../../../db/schemes/review.schemes';
import { QueryVinylModel } from '../../vinyl/model/input/QueryVinylModel';
import { VinylDBType, VinylDocument } from '../../../db/schemes/vinyl.shemes';
import { myReviewMapper } from '../mapper/my.review.mapper';
import { myVinylMapper } from '../mapper/my.vinyl.mapper';
import { MyReviewViewModel } from '../model/output/MyReviewViewModel';
import { MyVinylViewModel } from '../model/output/MyVinylViewModel';

@Injectable()
export class UserQueryRepository {
  constructor(
    @InjectModel(UserDBType.name) private userModel: Model<UserDocument>,
    @InjectModel(ReviewDBType.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(VinylDBType.name) private vinylModel: Model<VinylDocument>,
  ) {}
  async getUserById(id: string): Promise<UserProfileViewModel | null> {
    const user = await this.userModel.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return null;
    }

    return userProfileMapper(user);
  }

  async getMyReview(
    id: string,
    term: QueryVinylModel,
  ): Promise<MyReviewViewModel> {
    const sortBy: string = term.sortBy ?? 'createdAt';
    const sortDirection: 'asc' | 'desc' = term.sortDirection ?? 'desc';
    const pageNumber: number = term.pageNumber ?? 1;
    const pageSize: number = term.pageSize ?? 10;

    const review = await this.reviewModel
      .find({ userId: id })
      .sort([[sortBy, sortDirection]])
      .skip((pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .lean();

    const totalCount: number = await this.reviewModel.countDocuments({
      userId: id,
    });

    const pagesCount: number = Math.ceil(totalCount / +pageSize);

    const vinyl = [];
    for (let i = 0; i < review.length; i++) {
      const findVinyl = await this.vinylModel
        .find({ _id: new ObjectId(review[i].vinylId) })
        .lean();
      vinyl.push(findVinyl);
    }

    return {
      pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: review.map((review) => myReviewMapper(review, vinyl.flat())),
    };
  }

  async myVinyls(id: string, term: QueryVinylModel): Promise<MyVinylViewModel> {
    const searchTitleTerm: string = term.searchTitleTerm ?? null;
    const searchAuthorTerm: string = term.searchAuthorTerm ?? null;
    const sortBy: string = term.sortBy ?? 'createdAt';
    const sortDirection: 'asc' | 'desc' = term.sortDirection ?? 'desc';
    const pageNumber: number = term.pageNumber ?? 1;
    const pageSize: number = term.pageSize ?? 10;

    const user = await this.userModel.findOne({ _id: new ObjectId(id) }).lean();

    const vinylsId = user.purchasedVinyl.map(
      (purchasedDate) => new ObjectId(purchasedDate.vinylId),
    );

    let filter: any = { _id: { $in: vinylsId } };
    if (searchTitleTerm) {
      filter = {
        _id: { $in: vinylsId },
        title: { $regex: searchTitleTerm, $options: 'i' },
      };
    }
    if (searchAuthorTerm) {
      filter = {
        _id: { $in: vinylsId },
        author: { $regex: searchAuthorTerm, $options: 'i' },
      };
    }
    if (searchTitleTerm && searchAuthorTerm) {
      filter = {
        _id: { $in: vinylsId },
        $and: [
          {
            $or: [
              { title: { $regex: searchTitleTerm, $options: 'i' } },
              { author: { $regex: searchAuthorTerm, $options: 'i' } },
            ],
          },
        ],
      };
    }

    const vinyls = await this.vinylModel
      .find(filter)
      .sort([[sortBy, sortDirection]])
      .skip((pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .lean();

    const totalCount: number = await this.vinylModel.countDocuments(filter);

    const pagesCount: number = Math.ceil(totalCount / +pageSize);

    return {
      pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: vinyls.map((vinyl) => myVinylMapper(vinyl, user)),
    };
  }
}
