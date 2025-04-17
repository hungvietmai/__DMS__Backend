import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Types } from 'mongoose';
import { Student } from '../../student/schemas/student.schema.js';

@Schema({ timestamps: true })
export class ParkingSession {
    @Prop({ type: Types.ObjectId, ref: Student.name, required: true })
    studentId!: Types.ObjectId;

    @Prop({ required: true, uppercase: true, trim: true })
    plate!: string;

    @Prop({ required: true })
    outTime!: Date;

    @Prop()
    inTime!: Date;

    @Prop({ min: 0 })
    fee!: number;                          // 0 or 3 000
}

export type ParkingSessionDocument = HydratedDocument<ParkingSession>;
export const ParkingSessionSchema = SchemaFactory.createForClass(ParkingSession);
ParkingSessionSchema.index({ studentId: 1, outTime: 1 });
