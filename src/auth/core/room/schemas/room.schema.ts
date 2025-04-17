// room.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Room {
    @Prop({ required: true, unique: true, trim: true })
    roomNo!: string;                       // e.g. "A101"

    @Prop({ trim: true })
    roomType!: string;                     // e.g. "standard", "vip", …

    @Prop({ required: true, min: 0 })
    pricePerMonth!: number;                // VND

    @Prop({ required: true, min: 1 })
    capacity!: number;                     // max occupants
}

export type RoomDocument = HydratedDocument<Room>;
export const RoomSchema = SchemaFactory.createForClass(Room);
RoomSchema.index({ roomNo: 1 }, { unique: true });
