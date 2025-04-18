import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, type StudentDocument } from './schemas/student.schema.js';

@Injectable()
export class StudentService {
    constructor(
        @InjectModel(Student.name)
        private readonly studentModel: Model<StudentDocument>,
    ) { }

    async create(data: {
        studentCode: string;
        studentName: string;
        idCard: string;
        dob: Date;
        class?: string;
        hometown?: string;
    }) {
        return this.studentModel.create(data);
    }
}
