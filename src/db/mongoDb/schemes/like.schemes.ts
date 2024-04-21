import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LikeDocument = HydratedDocument<LikeMongoType>;

@Schema()
export class LikeMongoType {
  @Prop({
    required: true,
  })
  _id: string;

  @Prop({
    required: true,
  })
  userId: string;

  @Prop({
    required: true,
  })
  postId: string;
}

export const LikeSchema = SchemaFactory.createForClass(LikeMongoType);
