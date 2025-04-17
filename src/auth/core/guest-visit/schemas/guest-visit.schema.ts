import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Types } from 'mongoose';
import { Student } from '../../student/schemas/student.schema.js';

@Schema({ timestamps: true })
export class GuestVisit {
    @Prop({ required: true, trim: true })
    guestName!: string;

    @Prop({ match: /^\d{9,12}$/ })
    guestIdCard!: string;

    @Prop()
    guestDateOfBirth!: Date;

    @Prop({ type: Types.ObjectId, ref: Student.name, required: true })
    studentId!: Types.ObjectId;

    @Prop({ default: Date.now })
    visitedAt!: Date;
}

export type GuestVisitDocument = HydratedDocument<GuestVisit>;
export const GuestVisitSchema = SchemaFactory.createForClass(GuestVisit);
GuestVisitSchema.index({ studentId: 1, visitedAt: 1 });