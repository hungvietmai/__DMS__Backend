import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './schemas/user.schema.js';
import { UserService } from './user.service.js';
import { UsersController } from './users.controller.js';
import { Student, StudentSchema } from '../../core/student/schemas/student.schema.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Student.name, schema: StudentSchema },])],
  controllers: [UsersController],
  providers: [UserService,],
  exports: [UserService],
})
export class UserModule { }
