import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

export type OrderDocument = HydratedDocument<OrderDBType>;

@Schema()
export class OrderDBType {
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
  createdAt: string;

  @Prop({
    required: true,
  })
  price: number;
}

export const OrderSchema = SchemaFactory.createForClass(OrderDBType);
