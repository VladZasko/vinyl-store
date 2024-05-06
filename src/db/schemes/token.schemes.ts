import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type RefreshTokenMetaDocument = HydratedDocument<RefreshTokenMetaDBType>;

@Schema()
export class RefreshTokenMetaDBType {
  //_id: ObjectId;

  @Prop({
    required: true,
  })
  issuedAt: string;

  @Prop({
    required: true,
  })
  deviseName: string;

  @Prop({
    required: true,
  })
  userId: string;
}

export const RefreshTokenMetaSchema = SchemaFactory.createForClass(
  RefreshTokenMetaDBType,
);
