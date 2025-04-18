import { Student } from '@/core/student/schemas/student.schema.js';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ enum: ['student', 'admin'], default: 'student' })
  role!: 'student' | 'admin';

  @Prop({ type: Types.ObjectId, ref: Student.name, required: true })
  studentId!: Types.ObjectId;

  @Prop({ default: true })
  isActive!: boolean;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
