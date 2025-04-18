import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Student, StudentSchema } from './schemas/student.schema.js';
import { StudentService } from './student.service.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }])],
  controllers: [],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
