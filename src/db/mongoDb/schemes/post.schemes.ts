import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PostDocument = HydratedDocument<PostMongoType>;

@Schema()
export class PostMongoType {
  @Prop({
    required: true,
  })
  _id: string;

  @Prop({
    required: true,
  })
  fullName: string;

  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    required: true,
  })
  createdAt: string;

  @Prop({
    required: true,
  })
  userId: string;
}

export const PostSchema = SchemaFactory.createForClass(PostMongoType);
