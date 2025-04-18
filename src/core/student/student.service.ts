import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { CreateStudentDto } from './dto/create-student.dto.js';
import type { StudentResponseDto } from './dto/student-response.dto.js';
import { Student, type StudentDocument } from './schemas/student.schema.js';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  async create(dto: CreateStudentDto): Promise<StudentResponseDto> {
    return this.studentModel.create(dto);
  }
}
