import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  Actions,
  Entity,
} from '../../feauters/systenLogs/model/dto/AddLogsDto';

export type SystemLogsDocument = HydratedDocument<SystemLogsDBType>;

@Schema()
export class SystemLogsDBType {
  _id: ObjectId;

  @Prop({
    required: true,
  })
  actions: Actions;

  @Prop({
    required: true,
  })
  entity: Entity;

  @Prop({
    required: true,
  })
  userId: string;

  @Prop({
    required: true,
  })
  createdAt: string;
}

export const SystemLogsSchema = SchemaFactory.createForClass(SystemLogsDBType);
