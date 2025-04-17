import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Types } from 'mongoose';
import { Room } from '../../room/schemas/room.schema.js';

@Schema({ timestamps: true })
export class Student {
    @Prop({ required: true, unique: true, trim: true })
    studentCode!: string;

    @Prop({ required: true, unique: true, match: /^\d{9,12}$/ })
    idCard!: string;

    @Prop({ required: true })
    dateOfBirth!: Date;

    @Prop()
    className!: string;

    @Prop()
    hometown!: string;

    @Prop({ type: Types.ObjectId, ref: Room.name, required: true })
    roomId!: Types.ObjectId;               // reference to rooms

    @Prop({ enum: ['active', 'left'], default: 'active' })
    status!: string;
}

export type StudentDocument = HydratedDocument<Student>;
export const StudentSchema = SchemaFactory.createForClass(Student);
StudentSchema.index({ studentCode: 1 }, { unique: true });
StudentSchema.index({ idCard: 1 }, { unique: true });
