import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, type FilterQuery } from 'mongoose';

import type { CreateServiceUsageDto } from './dto/create-service-usage.dto.js';
import { ServiceUsage, type ServiceUsageDocument } from './schemas/service-usage.schema.js';

@Injectable()
export class ServiceUsageService {
  constructor(
    @InjectModel(ServiceUsage.name)
    private readonly usageModel: Model<ServiceUsageDocument>,
  ) {}

  /** Log a new service usage */
  async logUsage(dto: CreateServiceUsageDto): Promise<ServiceUsageDocument> {
    const studentId = new Types.ObjectId(dto.studentId);
    const usedAt = dto.usedAt ? new Date(dto.usedAt) : new Date();
    const quantity = dto.quantity ?? 1;
    const amount = dto.unitPriceSnapshot * quantity;

    const usage = new this.usageModel({
      studentId,
      serviceName: dto.serviceName,
      unitPriceSnapshot: dto.unitPriceSnapshot,
      usedAt,
      quantity,
      amount,
    });

    return usage.save();
  }

  /** List usage logs, filter by studentId and/or date range */
  async listUsages(opts: { studentId?: string; from?: string; to?: string }): Promise<ServiceUsageDocument[]> {
    const filter: FilterQuery<ServiceUsageDocument> = {};
    if (opts.studentId) {
      filter.studentId = new Types.ObjectId(opts.studentId);
    }
    if (opts.from || opts.to) {
      filter.usedAt = {};
      if (opts.from) filter.usedAt.$gte = new Date(opts.from);
      if (opts.to) filter.usedAt.$lte = new Date(opts.to);
    }
    return this.usageModel.find(filter).sort({ usedAt: -1 }).exec();
  }
}
