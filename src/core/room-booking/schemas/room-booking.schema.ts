import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Types } from 'mongoose';

@Schema({ collection: 'roomBookings', timestamps: true })
export class RoomBooking {
  /** The student who booked */
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true, index: true })
  studentId!: Types.ObjectId;

  /** The room assigned */
  @Prop({ type: Types.ObjectId, ref: 'Room', required: true, index: true })
  roomId!: Types.ObjectId;

  /** When the booking started */
  @Prop({ required: true })
  from!: Date;

  /** Will automate be the end of that month of the booking started */
  @Prop()
  to!: Date;

  /** For easier query, denormalized from students and rooms collections */
  @Prop({ required: true }) studentCode!: string;
  @Prop({ required: true }) studentName!: string;
  @Prop({ required: true }) roomNo!: string;
  @Prop({ required: true }) roomType!: string;
  @Prop({ required: true, min: 0 }) pricePerMonth!: number;
}

export type RoomBookingDocument = HydratedDocument<RoomBooking>;
export const RoomBookingSchema = SchemaFactory.createForClass(RoomBooking);

// Compound index for fast history and current‑booking lookups
RoomBookingSchema.index({ studentId: 1, from: -1 }, { name: 'byStudent_recentFirst' });
RoomBookingSchema.index({ roomId: 1, from: -1 }, { name: 'byRoom_recentFirst' });
