import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PostDocument,
  PostMongoType,
} from '../../../db/mongoDb/schemes/post.schemes';
import { UpdatePostDTO } from '../models/input/UpdatePostModel';
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

  async createPost(crateData: any): Promise<boolean> {
    const createdPost = new this.postModel(crateData);
    await createdPost.save();

    return true;
  }

  async updatePost(upData: UpdatePostDTO): Promise<boolean> {
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

  async createLike(likesData: any) {
    const createdLike = new this.likeModel(likesData);
    await createdLike.save();

    return true;
  }

  async deleteLikeById(id: string) {
    const deleteLike = await this.likeModel.deleteOne({ _id: id });

    return !!deleteLike.deletedCount;
  }
  // async updateLike(likesData: any): Promise<boolean> {
  //   const postId = likesData.postId;
  //   const userId = likesData.userId;
  //   const like = await this.likeRepository
  //     .createQueryBuilder('like')
  //     .where('like.postId = :postId', { postId })
  //     .andWhere('like.userId = :userId', { userId })
  //     .getOne();
  //
  //   if (!like) {
  //     await this.likeRepository.save(likesData);
  //     return true;
  //   } else {
  //     await this.likeRepository.delete(like.id);
  //   }
  // }
  async deletePostById(id: string) {
    const deletePost = await this.postModel.deleteOne({ _id: id });

    return !!deletePost.deletedCount;
  }
}
