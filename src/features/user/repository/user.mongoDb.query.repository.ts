import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserDocument,
  UserMongoType,
} from '../../../db/mongoDb/schemes/user.schemes';
import { meUserMapper } from '../mapper/me.user.mapper';
import { QueryPostsModel } from '../../post/models/input/QueryPostModule';
import {
  PostDocument,
  PostMongoType,
} from '../../../db/mongoDb/schemes/post.schemes';
import {
  LikeDocument,
  LikeMongoType,
} from '../../../db/mongoDb/schemes/like.schemes';
import { userQueryMapper } from '../mapper/user.query.mapper';

@Injectable()
export class UserMongoDbQueryRepository {
  constructor(
    @InjectModel(UserMongoType.name) private userModel: Model<UserDocument>,
    @InjectModel(PostMongoType.name) private postModel: Model<PostDocument>,
    @InjectModel(LikeMongoType.name) private likeModel: Model<LikeDocument>,
  ) {}

  async getUserById(id: string) {
    const findUser = await this.userModel.findOne({ _id: id });

    return meUserMapper(findUser);
  }

  async getAllUser(sortData: QueryPostsModel, id: string) {
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;
    const sortBy = sortData.sortBy ?? 'createdAt';
    const sortDirection = sortData.sortDirection ?? 'desc';

    const users = await this.userModel
      .find()
      .sort([[sortBy, sortDirection]])
      .skip((pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .lean();

    const totalCount = await this.userModel.countDocuments();

    const pagesCount = Math.ceil(totalCount / +pageSize);

    const postForUser = await this.postModel.find().lean();

    const likesForPost = await this.likeModel.find().lean();

    return {
      pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: users.map((users) =>
        userQueryMapper(users, likesForPost, postForUser, id),
      ),
    };
  }
}
