import { HydratedDocument } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<UserMongoType>;

@Schema()
export class UserMongoType {
  @Prop({
    required: true,
  })
  _id: string;

  @Prop({
    required: true,
  })
  login: string;

  @Prop({
    required: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  lastName: string;

  @Prop({
    required: true,
  })
  firstName: string;

  @Prop({
    required: true,
  })
  createdAt: string;
}

export const UserSchema = SchemaFactory.createForClass(UserMongoType);
