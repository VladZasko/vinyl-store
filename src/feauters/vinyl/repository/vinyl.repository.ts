import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VinylDBType, VinylDocument } from '../../../db/schemes/vinyl.shemes';
import { vinylMapper } from '../mapper/vinyl.mapper';
import { ObjectId } from 'mongodb';
import {
  ReviewDBType,
  ReviewDocument,
} from '../../../db/schemes/review.schemes';
import { UserDBType, UserDocument } from '../../../db/schemes/user.schemes';
import { OrderDBType, OrderDocument } from '../../../db/schemes/order.schemes';
import { CreateVinylDto } from '../model/dto/CreateVinylDto';
import { VinylsType } from '../model/output/VinylsViewModel';
import { CreateReviewRepositoryDto } from '../model/dto/CreateReviewRepositoryDto';
import { CreateOrderDto } from '../model/dto/CreateOrderDto';
import { CreateVinylModel } from '../model/input/CreateVinylModel';

@Injectable()
export class VinylRepository {
  constructor(
    @InjectModel(VinylDBType.name) private vinylModel: Model<VinylDocument>,
    @InjectModel(ReviewDBType.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(UserDBType.name) private userModel: Model<UserDocument>,
    @InjectModel(OrderDBType.name) private orderModel: Model<OrderDocument>,
  ) {}

  async createVinyl(createData: CreateVinylDto): Promise<VinylsType> {
    const createVinyl = await this.vinylModel.create(createData);
    await createVinyl.save();
    return vinylMapper(createVinyl);
  }

  async createOrder(createData: CreateOrderDto): Promise<OrderDBType> {
    const createOrder = await this.orderModel.create(createData);
    await createOrder.save();
    return createOrder;
  }

  async findOrder(createData: string) {
    const findOrder = await this.orderModel.findOne({
      _id: new ObjectId(createData),
    });
    return findOrder;
  }

  async finishBuyVinyl(buyData: any) {
    const buyVinyl = await this.userModel.updateOne(
      { _id: new ObjectId(buyData.userId) },
      {
        $push: {
          purchasedVinyl: {
            vinylId: buyData.vinylId,
            purchasedDate: buyData.purchasedDate,
          },
        },
      },
    );
    return !!buyVinyl.matchedCount;
  }

  async updateVinyl(vinylId: string, updateData: CreateVinylModel) {
    const updateVinyl = await this.vinylModel.updateOne(
      { _id: new ObjectId(vinylId) },
      {
        $set: {
          title: updateData.title,
          author: updateData.author,
          description: updateData.description,
          price: updateData.price,
          quantity: updateData.quantity,
        },
      },
    );
    return !!updateVinyl.matchedCount;
  }

  async updateQuantity(vinylId: string) {
    const updateQuantity = await this.vinylModel.updateOne(
      { _id: new ObjectId(vinylId) },
      { $inc: { quantity: -1 } },
    );
    return !!updateQuantity.matchedCount;
  }
  async createReview(createData: CreateReviewRepositoryDto) {
    const createReview = await this.reviewModel.create(createData);
    await createReview.save();
    return true;
  }
  async deleteVinyl(id: string): Promise<boolean> {
    const deleteVinyl = await this.vinylModel.deleteOne({
      _id: new ObjectId(id),
    });

    return !!deleteVinyl.deletedCount;
  }
}
