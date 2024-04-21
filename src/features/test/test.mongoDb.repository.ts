import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserDocument,
  UserMongoType,
} from '../../db/mongoDb/schemes/user.schemes';
import {
  PostDocument,
  PostMongoType,
} from '../../db/mongoDb/schemes/post.schemes';
import {
  LikeDocument,
  LikeMongoType,
} from '../../db/mongoDb/schemes/like.schemes';

@Injectable()
export class TestMongoDbQueryRepository {
  constructor(
    @InjectModel(UserMongoType.name) private userModel: Model<UserDocument>,
    @InjectModel(PostMongoType.name) private postModel: Model<PostDocument>,
    @InjectModel(LikeMongoType.name) private likeModel: Model<LikeDocument>,
  ) {}
  async createUser(createData: any): Promise<boolean> {
    const user = new this.userModel(createData);
    await user.save();

    return true;
  }
  async createPost(crateData: any): Promise<boolean> {
    const createdPost = new this.postModel(crateData);
    await createdPost.save();

    return true;
  }

  async createLike(likesData: any) {
    const createdLike = new this.likeModel(likesData);
    await createdLike.save();

    return true;
  }

  async deleteAllData() {
    await this.postModel.deleteMany({});
    await this.userModel.deleteMany({});
    await this.likeModel.deleteMany({});
    return;
  }
}
