import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Student } from '../../../core/student/schemas/student.schema.js';

export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ enum: UserRole, default: UserRole.STUDENT })
  role!: UserRole;

  @Prop({ type: Types.ObjectId, ref: Student.name, required: true })
  studentId!: Types.ObjectId;

  @Prop({ default: true })
  isActive!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
