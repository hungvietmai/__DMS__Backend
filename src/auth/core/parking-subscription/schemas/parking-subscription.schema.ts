import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Types } from 'mongoose';
import { Student } from '../../student/schemas/student.schema.js';

@Schema({ timestamps: true })
export class ParkingSubscription {
    @Prop({ type: Types.ObjectId, ref: Student.name, required: true })
    studentId!: Types.ObjectId;

    @Prop({ required: true, uppercase: true, trim: true })
    plate!: string;

    @Prop({ default: Date.now })
    startedAt!: Date;

    @Prop()
    endedAt!: Date | null;

    @Prop({ default: 100_000 })
    basePrice!: number;
}

export type ParkingSubscriptionDocument = HydratedDocument<ParkingSubscription>;
export const ParkingSubscriptionSchema = SchemaFactory.createForClass(ParkingSubscription);
ParkingSubscriptionSchema.index(
    { studentId: 1, plate: 1, endedAt: 1 },
    { unique: true }
);