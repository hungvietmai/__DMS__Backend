import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Types } from 'mongoose';

@Schema({
    collection: 'guestVisits',
    timestamps: { createdAt: true, updatedAt: false },
})
export class GuestVisit {
    @Prop({ required: true, match: /^\d{9,12}$/ })
    guestIdCard!: string;

    @Prop({ required: true })
    guestName!: string;

    @Prop() guestDob?: Date;

    @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
    studentId!: Types.ObjectId;

    @Prop({ required: true })
    visitedAt!: Date;
}

export type GuestVisitDocument = HydratedDocument<GuestVisit>;
export const GuestVisitSchema = SchemaFactory.createForClass(GuestVisit);

GuestVisitSchema.index({ studentId: 1, visitedAt: 1 });
GuestVisitSchema.index({ guestIdCard: 1, visitedAt: 1 });