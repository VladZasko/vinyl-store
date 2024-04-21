import { Injectable } from '@nestjs/common';
import { QueryPostsModel } from '../models/input/QueryPostModule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PostDocument,
  PostMongoType,
} from '../../../db/mongoDb/schemes/post.schemes';
import {
  LikeDocument,
  LikeMongoType,
} from '../../../db/mongoDb/schemes/like.schemes';
import { postQueryMapper } from '../mapper/post.query.mapper';

@Injectable()
export class PostMongoDbQueryRepository {
  constructor(
    @InjectModel(PostMongoType.name) private postModel: Model<PostDocument>,
    @InjectModel(LikeMongoType.name) private likeModel: Model<LikeDocument>,
  ) {}

  async getAllPosts(sortData: QueryPostsModel, id: string) {
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;
    const sortBy = sortData.sortBy ?? 'createdAt';
    const sortDirection = sortData.sortDirection ?? 'desc';

    const posts = await this.postModel
      .find()
      .sort([[sortBy, sortDirection]])
      .skip((pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .lean();

    const totalCount = await this.postModel.countDocuments();

    const pagesCount = Math.ceil(totalCount / +pageSize);

    const likesForPost = await this.likeModel.find().lean();

    return {
      pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: posts.map((posts) => postQueryMapper(posts, likesForPost, id)),
    };
  }

  async getPostsById(sortData: QueryPostsModel, id: string) {
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;
    const sortBy = sortData.sortBy ?? 'createdAt';
    const sortDirection = sortData.sortDirection ?? 'desc';

    const posts = await this.postModel
      .find({ userId: id })
      .sort([[sortBy, sortDirection]])
      .skip((pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .lean();

    const totalCount = await this.postModel.countDocuments();

    const pagesCount = Math.ceil(totalCount / +pageSize);

    const likesForPost = await this.likeModel.find().lean();

    return {
      pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: posts.map((posts) => postQueryMapper(posts, likesForPost, id)),
    };
  }
}
