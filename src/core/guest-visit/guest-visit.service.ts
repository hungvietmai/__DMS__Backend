import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, type FilterQuery } from 'mongoose';

import type { CreateGuestVisitDto } from './dto/create-guest-visit.dto.js';
import { GuestVisit, type GuestVisitDocument } from './schemas/guest-visit.schema.js';

@Injectable()
export class GuestVisitService {
  constructor(
    @InjectModel(GuestVisit.name)
    private readonly visitModel: Model<GuestVisitDocument>,
  ) {}

  /** Log a new visit */
  async logVisit(dto: CreateGuestVisitDto): Promise<GuestVisitDocument> {
    const created = new this.visitModel({
      guestIdCard: dto.guestIdCard,
      guestName: dto.guestName,
      guestDob: dto.guestDob ? new Date(dto.guestDob) : undefined,
      studentId: new Types.ObjectId(dto.studentId),
      visitedAt: new Date(dto.visitedAt),
    });

    return created.save();
  }

  /** List visits, optionally filtered by studentId and/or date range */
  async listVisits(opts: { studentId?: string; from?: string; to?: string }): Promise<GuestVisitDocument[]> {
    const filter: FilterQuery<GuestVisitDocument> = {};

    if (opts.studentId) {
      filter.studentId = new Types.ObjectId(opts.studentId);
    }

    if (opts.from || opts.to) {
      filter.visitedAt = {};
      if (opts.from) filter.visitedAt.$gte = new Date(opts.from);
      if (opts.to) filter.visitedAt.$lte = new Date(opts.to);
    }

    return this.visitModel.find(filter).sort({ visitedAt: -1 }).exec();
  }
}
