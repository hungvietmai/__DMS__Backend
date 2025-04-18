import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UpdateRoomDto } from './dto//update-room.dto.js';
import { CreateRoomDto } from './dto/create-room.dto.js';
import { Room, type RoomDocument } from './schemas/room.schema.js';

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>) {}

  async create(dto: CreateRoomDto): Promise<RoomDocument> {
    return this.roomModel.create(dto);
  }

  async findAll(): Promise<RoomDocument[]> {
    return this.roomModel.find().exec();
  }

  async findOne(id: string): Promise<RoomDocument> {
    const room = await this.roomModel.findById(id).exec();
    if (!room) throw new NotFoundException(`Room ${id} not found`);
    return room;
  }

  async update(id: string, dto: UpdateRoomDto): Promise<RoomDocument> {
    const room = await this.roomModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!room) throw new NotFoundException(`Room ${id} not found`);
    return room;
  }

  async remove(id: string): Promise<void> {
    const res = await this.roomModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException(`Room ${id} not found`);
  }
}
