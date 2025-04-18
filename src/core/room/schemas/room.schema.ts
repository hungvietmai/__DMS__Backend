import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

@Schema({ collection: 'rooms' })
export class Room {
  @Prop({ required: true, unique: true })
  roomNo!: string;

  @Prop({ enum: ['standard', 'vip'], default: 'standard' })
  roomType!: string;

  @Prop({ min: 0 })
  pricePerMonth!: number;

  @Prop({ min: 1 })
  capacity!: number;
}

export type RoomDocument = HydratedDocument<Room>;
export const RoomSchema = SchemaFactory.createForClass(Room);
RoomSchema.index({ roomNo: 1 }, { unique: true });
