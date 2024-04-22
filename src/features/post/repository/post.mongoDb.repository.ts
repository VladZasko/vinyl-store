import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PostDocument,
  PostMongoType,
} from '../../../db/mongoDb/schemes/post.schemes';
import { UpdatePostType } from '../models/input/UpdatePostModel';
import {
  LikeDocument,
  LikeMongoType,
} from '../../../db/mongoDb/schemes/like.schemes';

@Injectable()
export class PostMongoDbRepository {
  constructor(
    @InjectModel(PostMongoType.name) private postModel: Model<PostDocument>,
    @InjectModel(LikeMongoType.name) private likeModel: Model<LikeDocument>,
  ) {}

  async createPost(crateData: PostMongoType): Promise<boolean> {
    const createdPost = new this.postModel(crateData);
    await createdPost.save();

    return true;
  }

  async updatePost(upData: UpdatePostType): Promise<boolean> {
    await this.postModel.updateOne(
      { _id: upData.id },
      {
        $set: {
          title: upData.title,
          description: upData.description,
        },
      },
    );
    return true;
  }

  async createLike(likesData: LikeMongoType): Promise<boolean> {
    const createdLike = new this.likeModel(likesData);
    await createdLike.save();

    return true;
  }

  async deleteLikeById(id: string): Promise<boolean> {
    const deleteLike = await this.likeModel.deleteOne({ _id: id });

    return !!deleteLike.deletedCount;
  }
  async deletePostById(id: string): Promise<boolean> {
    const deletePost = await this.postModel.deleteOne({ _id: id });

    return !!deletePost.deletedCount;
  }
}
