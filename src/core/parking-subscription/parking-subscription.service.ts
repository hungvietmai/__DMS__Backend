import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, type FilterQuery, type UpdateQuery } from 'mongoose';

import type { CreateParkingSubscriptionDto } from './dto/create-parking-subscription.dto.js';
import type { UpdateParkingSubscriptionDto } from './dto/update-parking-subscription.dto.js';
import { ParkingSubscription, type ParkingSubscriptionDocument } from './schemas/parking-subscription.schema.js';

@Injectable()
export class ParkingSubscriptionService {
  constructor(
    @InjectModel(ParkingSubscription.name)
    private readonly subModel: Model<ParkingSubscriptionDocument>,
  ) {}

  /** Create a new monthly parking pass */
  async create(dto: CreateParkingSubscriptionDto) {
    const studentId = new Types.ObjectId(dto.studentId);
    const licensePlate = dto.licensePlate.trim().toUpperCase();

    // Enforce max 2 active passes per student
    const activeCount = await this.subModel.countDocuments({
      studentId,
      isActive: true,
    });
    if (activeCount >= 2) {
      throw new ConflictException('A student may have at most 2 active parking subscriptions');
    }

    const sub = new this.subModel({
      studentId,
      plate: licensePlate,
      vehicleType: dto.vehicleType,
      startedAt: dto.startedAt ? new Date(dto.startedAt) : new Date(),
      isActive: true,
    });
    return sub.save();
  }

  /** List all subscriptions, or filter by studentId */
  async findAll(studentId?: string) {
    const filter: FilterQuery<ParkingSubscriptionDocument> = {};
    if (studentId) filter.studentId = new Types.ObjectId(studentId);
    return this.subModel.find(filter).sort({ startedAt: -1 }).exec();
  }

  /** Get one by ID */
  async findOne(id: string) {
    const doc = await this.subModel.findById(id).exec();
    if (!doc) throw new NotFoundException(`Subscription ${id} not found`);
    return doc;
  }

  /** Update license plate, type, start date, or active flag */
  async update(id: string, dto: UpdateParkingSubscriptionDto) {
    const updateData: UpdateQuery<ParkingSubscription> = {};
    if (dto.licensePlate) updateData.licensePlate = dto.licensePlate.trim().toUpperCase();
    if (dto.vehicleType) updateData.vehicleType = dto.vehicleType;
    if (dto.startedAt) updateData.startedAt = new Date(dto.startedAt);
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    const doc = await this.subModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!doc) throw new NotFoundException(`Subscription ${id} not found`);
    return doc;
  }

  /** Soft‑disable a subscription */
  async deactivate(id: string) {
    const doc = await this.subModel.findById(id).exec();
    if (!doc) throw new NotFoundException(`Subscription ${id} not found`);
    doc.isActive = false;
    return doc.save();
  }

  /** Reactivate a subscription */
  async reactivate(id: string) {
    const doc = await this.subModel.findById(id).exec();
    if (!doc) throw new NotFoundException(`Subscription ${id} not found`);
    doc.isActive = true;
    return doc.save();
  }
}
