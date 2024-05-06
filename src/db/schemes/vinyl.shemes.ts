import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

export type VinylDocument = HydratedDocument<VinylDBType>;

@Schema()
export class VinylDBType {
  _id: ObjectId;

  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  author: string;

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
  price: number;

  @Prop({
    required: true,
  })
  quantity: number;
}

export const VinylSchema = SchemaFactory.createForClass(VinylDBType);
