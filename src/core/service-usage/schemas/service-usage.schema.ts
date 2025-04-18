import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Types } from 'mongoose';

import { Student } from '../../student/schemas/student.schema.js';

@Schema({ timestamps: true })
export class ServiceUsage {
  @Prop({ type: Types.ObjectId, ref: Student.name, required: true })
  studentId!: Types.ObjectId;

  @Prop({ default: Date.now })
  usedAt!: Date;

  @Prop({ min: 1, default: 1 })
  quantity!: number;

  @Prop({ min: 0 })
  amount!: number;

  @Prop({ required: true })
  serviceName!: string;

  @Prop({ required: true, min: 0 })
  unitPriceSnapshot!: number;
}

export type ServiceUsageDocument = HydratedDocument<ServiceUsage>;
export const ServiceUsageSchema = SchemaFactory.createForClass(ServiceUsage);

ServiceUsageSchema.index({ studentId: 1, usedAt: 1 });
