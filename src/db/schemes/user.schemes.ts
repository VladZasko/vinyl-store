import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';
import { RoleForUser } from '../../feauters/auth/model/dto/CreateUserDto';

export type UserDocument = HydratedDocument<UserDBType>;

@Schema()
export class AccountData {
  @Prop({
    required: true,
  })
  firstName: string;

  @Prop({
    required: true,
  })
  lastName: string;

  @Prop({
    required: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  dateOfBirth: string;

  @Prop({
    required: true,
  })
  createdAt: string;

  @Prop({
    required: true,
  })
  role: RoleForUser;

  @Prop({
    required: true,
  })
  avatar: string;

  @Prop({
    required: false,
  })
  passwordHash: string;

  @Prop({
    required: false,
  })
  passwordSalt: string;
}

@Schema()
export class PurchasedVinyl {
  @Prop({
    required: true,
  })
  vinylId: string;

  @Prop({
    required: true,
  })
  purchasedDate: string;
}

@Schema()
export class EmailConfirmation {
  @Prop({
    required: true,
  })
  confirmationCode: string;

  @Prop({
    required: true,
  })
  expirationDate: string;

  @Prop({
    required: true,
  })
  isConfirmed: boolean;
}

@Schema()
export class UserDBType {
  _id: ObjectId;

  @Prop({
    required: true,
  })
  accountData: AccountData;

  @Prop({
    required: false,
  })
  purchasedVinyl: PurchasedVinyl[];

  @Prop({
    required: false,
  })
  emailConfirmation: EmailConfirmation;
}

export const UserSchema = SchemaFactory.createForClass(UserDBType);
