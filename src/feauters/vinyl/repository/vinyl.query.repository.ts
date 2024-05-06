import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VinylDBType, VinylDocument } from '../../../db/schemes/vinyl.shemes';
import { QueryVinylUnauthorizedModel } from '../model/input/QueryVinylUnauthorizedModel';
import { vinylViewUnauthorizedMapper } from '../mapper/vinyl.all.user.mapper';
import { QueryVinylModel } from '../model/input/QueryVinylModel';
import { ObjectId } from 'mongodb';
import { vinylMapper } from '../mapper/vinyl.mapper';
import {
  ReviewDBType,
  ReviewDocument,
} from '../../../db/schemes/review.schemes';
import { reviewByVinylMapper } from '../mapper/review.vinyl.mapper';
import { VinylsAllUsersViewModel } from '../model/output/VinylsAllUsersViewModel';
import { VinylsViewModel } from '../model/output/VinylsViewModel';
import { ReviewsViewModel } from '../model/output/ReviewByVinylViewModel';

@Injectable()
export class VinylQueryRepository {
  constructor(
    @InjectModel(VinylDBType.name) private vinylModel: Model<VinylDocument>,
    @InjectModel(ReviewDBType.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async findVinylUnauthorized(
    term: QueryVinylUnauthorizedModel,
  ): Promise<VinylsAllUsersViewModel> {
    const pageNumber: number = term.pageNumber ?? 1;
    const pageSize: number = term.pageSize ?? 10;

    const vinyls = await this.vinylModel
      .find()
      .skip((pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .lean();

    const totalCount: number = await this.vinylModel.countDocuments();

    const pagesCount: number = Math.ceil(totalCount / +pageSize);

    const scoreReview = [];
    for (let i = 0; i < vinyls.length; i++) {
      const findReview = await this.reviewModel
        .find({ vinylId: vinyls[i]._id })
        .lean();
      scoreReview.push(findReview);
    }

    const firstReview = [];
    for (let i = 0; i < vinyls.length; i++) {
      const findReview = await this.reviewModel
        .find({ vinylId: vinyls[i]._id })
        .sort([['createdAt', 'asc']])
        .limit(1)
        .lean();
      firstReview.push(findReview);
    }

    return {
      pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: vinyls.map((vinyls) =>
        vinylViewUnauthorizedMapper(
          vinyls,
          firstReview.flat(),
          scoreReview.flat(),
        ),
      ),
    };
  }

  async findVinyls(term: QueryVinylModel): Promise<VinylsViewModel> {
    const searchTitleTerm: string = term.searchTitleTerm ?? null;
    const searchAuthorTerm: string = term.searchAuthorTerm ?? null;
    const sortBy: string = term.sortBy ?? 'createdAt';
    const sortDirection: 'asc' | 'desc' = term.sortDirection ?? 'desc';
    const pageNumber: number = term.pageNumber ?? 1;
    const pageSize: number = term.pageSize ?? 10;

    let filter = {};

    if (searchTitleTerm) {
      filter = {
        title: { $regex: searchTitleTerm, $options: 'i' },
      };
    }
    if (searchAuthorTerm) {
      filter = {
        author: { $regex: searchAuthorTerm, $options: 'i' },
      };
    }
    if (searchAuthorTerm && searchTitleTerm) {
      filter = {
        $or: [
          { title: { $regex: searchAuthorTerm, $options: 'i' } },
          { author: { $regex: searchTitleTerm, $options: 'i' } },
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
      items: vinyls.map(vinylMapper),
    };
  }

  async getReviewByVinylId(
    term: QueryVinylModel,
    vinylId: string,
  ): Promise<ReviewsViewModel> {
    const sortBy: string = term.sortBy ?? 'createdAt';
    const sortDirection: 'asc' | 'desc' = term.sortDirection ?? 'desc';
    const pageNumber: number = term.pageNumber ?? 1;
    const pageSize: number = term.pageSize ?? 10;

    const review = await this.reviewModel
      .find({ vinylId: vinylId })
      .sort([[sortBy, sortDirection]])
      .skip((pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .lean();

    const totalCount: number = await this.reviewModel.countDocuments({
      vinylId: vinylId,
    });

    const pagesCount: number = Math.ceil(totalCount / +pageSize);

    return {
      pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: review.map(reviewByVinylMapper),
    };
  }

  async getVinylId(id: string) {
    const vinyl = await this.vinylModel.findOne({ _id: new ObjectId(id) });
    if (!vinyl) {
      return null;
    }
    return vinylMapper(vinyl);
  }

  async getVinylById(id: string) {
    const vinyl = await this.vinylModel
      .findOne({ _id: new ObjectId(id) })
      .lean();
    if (!vinyl) {
      return null;
    }
    return vinyl;
  }
}
