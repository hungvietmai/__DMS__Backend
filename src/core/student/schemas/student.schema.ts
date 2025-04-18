import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Types } from 'mongoose';

/** Embedded sub-document for saved “regular” guests */
@Schema({ _id: false })
class RegularGuest {
  @Prop({ default: () => new Types.ObjectId() })
  _id!: Types.ObjectId;

  @Prop({ required: true, match: /^\d{9,12}$/ })
  guestIdCard!: string;

  @Prop({ required: true })
  guestName!: string;

  @Prop() guestDob!: Date;
}

@Schema({ collection: 'students', timestamps: true })
export class Student {
  @Prop({ required: true, unique: true })
  studentCode!: string;

  @Prop({ required: true }) studentName!: string;

  @Prop({ required: true, unique: true, match: /^\d{9,12}$/ })
  idCard!: string;

  @Prop({ required: true })
  dob!: Date;

  @Prop() class!: string;
  @Prop() hometown!: string;

  @Prop({ type: [RegularGuest], default: [] })
  regularGuests!: RegularGuest[];

  @Prop({ enum: ['active', 'left'], default: 'active' })
  status!: string;
}

export type StudentDocument = HydratedDocument<Student>;
export const StudentSchema = SchemaFactory.createForClass(Student);
StudentSchema.index({ roomId: 1 });
