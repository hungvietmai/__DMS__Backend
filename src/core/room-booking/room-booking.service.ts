import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, type Model } from 'mongoose';

import type { CreateBookingDto } from './dto/create-booking.dto.js';
import { RoomBooking, type RoomBookingDocument } from './schemas/room-booking.schema.js';
import { Room, type RoomDocument } from '../room/schemas/room.schema.js';
import { Student, type StudentDocument } from '../student/schemas/student.schema.js';

@Injectable()
export class RoomBookingService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
    @InjectModel(Room.name)
    private readonly roomModel: Model<RoomDocument>,
    @InjectModel(RoomBooking.name)
    private readonly bookingModel: Model<RoomBookingDocument>,
  ) {}

  /** Returns all rooms that have at least one free spot on `checkDate`. */
  async findAvailableRooms(checkDate: Date) {
    const pipeline = [
      // 1. Lookup bookings that cover checkDate
      {
        $lookup: {
          from: 'roomBookings',
          let: { rid: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$roomId', '$$rid'] }, { $lte: ['$from', checkDate] }, { $gte: ['$to', checkDate] }],
                },
              },
            },
          ],
          as: 'activeBookings',
        },
      },
      // 2. Count how many students occupy each room on that date
      {
        $addFields: {
          occupied: { $size: '$activeBookings' },
        },
      },
      // 3. Filter rooms where occupied < capacity
      {
        $match: {
          $expr: { $lt: ['$occupied', '$capacity'] },
        },
      },
      // 4. Project the fields you care about
      {
        $project: {
          roomNo: 1,
          roomType: 1,
          pricePerMonth: 1,
          capacity: 1,
          occupied: 1,
        },
      },
    ];

    return this.roomModel.aggregate(pipeline).exec();
  }

  /** Create a new monthly booking */
  async createBooking(dto: CreateBookingDto): Promise<RoomBookingDocument> {
    const studentId = new Types.ObjectId(dto.studentId);
    const roomId = new Types.ObjectId(dto.roomId);
    const fromDate = new Date(dto.from);

    // 1. Load student and room snapshots
    const student = await this.studentModel.findById(studentId, 'studentCode name').lean();
    if (!student) throw new NotFoundException('Student not found');

    const room = await this.roomModel.findById(roomId, 'roomNo roomType pricePerMonth').lean();
    if (!room) throw new NotFoundException('Room not found');

    // 2. Prevent overlapping booking on the same room
    const conflict = await this.bookingModel.findOne({
      roomId,
      // overlap: existing.from ≤ new.from < existing.to
      from: { $lte: fromDate },
      to: { $gte: fromDate },
    });
    if (conflict) {
      throw new ConflictException('Room is already booked for that period');
    }

    // 3. Save to db
    const booking = new this.bookingModel({
      studentId,
      studentCode: student.studentCode,
      studentName: student.studentName,
      roomId,
      roomNo: room.roomNo,
      roomType: room.roomType,
      pricePerMonth: room.pricePerMonth,
      from: fromDate,
    });

    return booking.save();
  }

  /** Get the booking active on a given date (defaults to today) */
  async getCurrentBooking(studentId: string, onDate: Date = new Date()): Promise<RoomBookingDocument | null> {
    return this.bookingModel.findOne({
      studentId: new Types.ObjectId(studentId),
      from: { $lte: onDate },
      to: { $gte: onDate },
    });
  }

  /** List full chronological history for a student */
  async listBookingHistory(studentId: string): Promise<RoomBookingDocument[]> {
    return this.bookingModel
      .find({ studentId: new Types.ObjectId(studentId) })
      .sort({ from: -1 })
      .exec();
  }
}
