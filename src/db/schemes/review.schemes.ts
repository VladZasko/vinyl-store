import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

export type ReviewDocument = HydratedDocument<ReviewDBType>;

@Schema()
export class ReviewDBType {
  _id: ObjectId;

  @Prop({
    required: true,
  })
  vinylId: string;

  @Prop({
    required: true,
  })
  userId: string;

  @Prop({
    required: true,
  })
  author: string;

  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    required: true,
  })
  createdAt: string;

  @Prop({
    required: true,
  })
  score: number;
}

export const ReviewSchema = SchemaFactory.createForClass(ReviewDBType);
