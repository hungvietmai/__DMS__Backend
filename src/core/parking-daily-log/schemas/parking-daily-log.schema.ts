import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Types } from 'mongoose';

import { ParkingSubscription } from '../../parking-subscription/schemas/parking-subscription.schema.js';

/** One entry per check‑in/out within a day */
@Schema({ _id: false })
export class ParkingSession {
  /** When the vehicle left the lot */
  @Prop({ required: true })
  outTime!: Date;

  /** When the vehicle returned */
  @Prop({ required: true })
  inTime!: Date;

  /** Fee charged for this session */
  @Prop({ required: true, min: 0 })
  fee!: number;
}

@Schema({ collection: 'parkingDailyLogs' })
export class ParkingDailyLog {
  /** Link back to the monthly pass */
  @Prop({ type: Types.ObjectId, ref: ParkingSubscription.name, required: true })
  subscriptionId!: Types.ObjectId;

  /** The calendar day (normalized to midnight) */
  @Prop({ required: true })
  date!: Date;

  /** All check‑in/out sessions for that day */
  @Prop({ type: [ParkingSession], default: [] })
  sessions!: ParkingSession[];

  /** Total fee for the day (computed atomically) */
  @Prop({ required: true, min: 0, default: 0 })
  totalFee!: number;
}

export type ParkingDailyLogDocument = HydratedDocument<ParkingDailyLog>;
export const ParkingDailyLogSchema = SchemaFactory.createForClass(ParkingDailyLog);

// One document per subscription per day
ParkingDailyLogSchema.index({ subscriptionId: 1, date: 1 }, { unique: true });
