import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Types } from 'mongoose';

import { Student } from '../../student/schemas/student.schema.js';

@Schema({ collection: 'parkingSubscriptions', timestamps: true })
export class ParkingSubscription {
  /** Owner of this monthly parking pass */
  @Prop({ type: Types.ObjectId, ref: Student.name, required: true, index: true })
  studentId!: Types.ObjectId;

  /** License plate tied to this pass */
  @Prop({ required: true, unique: true, trim: true })
  licensePlate!: string;

  /** Vehicle type (e.g. bike, motorbike, car) */
  @Prop({ enum: ['bike', 'motorbike', 'car'], default: 'motorbike' })
  vehicleType!: string;

  /** When the subscription started */
  @Prop({ required: true })
  startedAt!: Date;

  /** Whether this pass is still valid */
  @Prop({ default: true, index: true })
  isActive!: boolean;
}

export type ParkingSubscriptionDocument = HydratedDocument<ParkingSubscription>;
export const ParkingSubscriptionSchema = SchemaFactory.createForClass(ParkingSubscription);

// Fast lookup of a student’s active passes
ParkingSubscriptionSchema.index({ studentId: 1, isActive: 1 });
