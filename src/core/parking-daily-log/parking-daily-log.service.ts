import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, type FilterQuery } from 'mongoose';

import type { CreateParkingSessionDto } from './dto/create-parking-session.dto.js';
import { ParkingDailyLog, type ParkingDailyLogDocument } from './schemas/parking-daily-log.schema.js';
import { ParkingSubscription, type ParkingSubscriptionDocument } from '../parking-subscription/schemas/parking-subscription.schema.js';

@Injectable()
export class ParkingDailyLogService {
  constructor(
    @InjectModel(ParkingSubscription.name)
    private readonly subModel: Model<ParkingSubscriptionDocument>,
    @InjectModel(ParkingDailyLog.name)
    private readonly logModel: Model<ParkingDailyLogDocument>,
  ) {}

  /** Log one check‑in/out pair into that day’s document */
  async logSession(dto: CreateParkingSessionDto): Promise<ParkingDailyLogDocument> {
    const subId = new Types.ObjectId(dto.subscriptionId);
    const subscription = await this.subModel.findById(subId).lean();
    if (!subscription) throw new NotFoundException('Subscription not found');

    const outTime = new Date(dto.outTime);
    const inTime = new Date(dto.inTime);

    // 1. Normalize to midnight UTC of outTime's day
    const date = new Date(Date.UTC(outTime.getUTCFullYear(), outTime.getUTCMonth(), outTime.getUTCDate(), 0, 0, 0, 0));

    // 2. Find or create daily log
    let daily = await this.logModel.findOne({ subscriptionId: subId, date });
    daily ??= new this.logModel({ subscriptionId: subId, date, sessions: [], totalFee: 0 });

    // 3. Calculate fee: first 2 sessions free
    const sessionCount = daily.sessions.length;
    const fee = sessionCount < 2 ? 0 : 3000;

    // 4. Append session and update total
    daily.sessions.push({ outTime, inTime, fee });
    daily.totalFee += fee;

    return daily.save();
  }

  /**
   * List daily logs, optionally filtered by subscriptionId and/or date range.
   * If no filters, returns all logs.
   */
  async listDailyLogs(opts: { subscriptionId?: string; from?: string; to?: string }): Promise<ParkingDailyLogDocument[]> {
    const filter: FilterQuery<ParkingDailyLogDocument> = {};
    if (opts.subscriptionId) {
      filter.subscriptionId = new Types.ObjectId(opts.subscriptionId);
    }
    if (opts.from || opts.to) {
      filter.date = {};
      if (opts.from) filter.date.$gte = new Date(opts.from);
      if (opts.to) filter.date.$lte = new Date(opts.to);
    }
    return this.logModel.find(filter).sort({ date: -1 }).exec();
  }

  /**
   * List **all** sessions for a student across their subscriptions.
   */
  async listStudentSessions(
    studentId: string,
    from?: string,
    to?: string,
  ): Promise<
    {
      plate: string;
      date: Date;
      sessions: { outTime: Date; inTime: Date; fee: number }[];
      totalFee: number;
    }[]
  > {
    // 1. Get active or past subscriptions
    const subs = await this.subModel.find({ studentId: new Types.ObjectId(studentId) }, '_id plate').lean();
    const subIds = subs.map((s) => s._id);
    if (subIds.length === 0) return [];

    // 2. Retrieve daily logs
    const filter: FilterQuery<ParkingDailyLogDocument> = {
      subscriptionId: { $in: subIds },
    };
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const logs = await this.logModel.find(filter).sort({ date: -1 }).lean();

    // 3. Merge License Plate into output
    const plateMap = subs.reduce<Record<string, string>>((m, s) => {
      m[s._id.toHexString()] = s.licensePlate;
      return m;
    }, {});
    return logs.map((l) => ({
      plate: plateMap[l.subscriptionId.toHexString()],
      date: l.date,
      sessions: l.sessions,
      totalFee: l.totalFee,
    }));
  }
}
