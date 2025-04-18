import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash as bcryptHash, verify as bcryptVerify } from '@node-rs/bcrypt';
import { Model, Types } from 'mongoose';
import { isEmail } from 'validator';

import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UserResponseDto } from './dto/user-response.dto.js';
import { User, type UserDocument } from './schemas/user.schema.js';
import { Student, type StudentDocument } from '../../core/student/schemas/student.schema.js';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  /** Registration */
  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const exists = await this.userModel.exists({ email: dto.email });
    if (exists) throw new ConflictException('Email already in use');

    const passwordHash = await bcryptHash(dto.password, 12);

    const user = await this.userModel.create({
      email: dto.email,
      passwordHash,
      studentId: new Types.ObjectId(dto.studentId),
      role: dto.role,
    });

    const response: UserResponseDto = {
      id: user.studentId.toHexString(),
      email: user.email,
      studentId: user.studentId.toHexString(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      role: user.role,
    };

    return response;
  }

  /**
   * Validate credentials (email or studentCode),
   * then verify passwordHash with @node-rs/bcrypt
   */
  async validateUser(login: string, pass: string): Promise<UserDocument | null> {
    let user = await this.userModel.findOne({ email: login.toLowerCase(), isActive: true });
    if (!user && !isEmail(login)) {
      const student = await this.studentModel.findOne({ studentCode: login }).lean();
      if (student) {
        user = await this.userModel.findOne({ studentId: student._id, isActive: true });
      }
    }
    if (!user) return null;

    const ok = await bcryptVerify(pass, user.passwordHash);
    return ok ? user : null;
  }

  /** Fetch user profile */
  async findById(id: string) {
    return this.userModel.findById(id).populate('studentId', 'studentCode studentName').select('-passwordHash').exec();
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.find().lean();
    // strip out passwordHash
    return users.map((u) => {
      const user = {
        id: u.studentId.toHexString(),
        email: u.email,
        studentId: u.studentId.toHexString(),
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        role: u.role,
      };
      return user;
    });
  }
}
