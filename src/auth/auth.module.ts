import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard, LocalAuthGuard } from './guards/index.js';
import { JwtStrategy, LocalStrategy } from './strategies/index.js';
import { Student, StudentSchema } from '../core/student/schemas/student.schema.js';
import { StudentModule } from '../core/student/student.module.js';
import { User, UserSchema } from '../shared/user/schemas/user.schema.js';
import { UserModule } from '../shared/user/user.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    UserModule,
    StudentModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, LocalAuthGuard, JwtAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
