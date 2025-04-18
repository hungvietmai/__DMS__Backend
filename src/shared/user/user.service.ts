import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { hash as bcryptHash, verify as bcryptVerify } from '@node-rs/bcrypt';
import { User, type UserDocument } from './schemas/user.schema.js';
import { Student, type StudentDocument } from '@/core/student/schemas/student.schema.js';
import type { CreateUserDto } from './dto/create-user.dto.js';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) { }

  /** Registration */
  async create(dto: CreateUserDto): Promise<Omit<UserDocument, 'passwordHash'>> {
    const exists = await this.userModel.exists({ email: dto.email });
    if (exists) throw new ConflictException('Email already in use');

    const passwordHash = await bcryptHash(dto.password, 12);

    const user = await this.userModel.create({
      email: dto.email,
      passwordHash,
      studentId: new Types.ObjectId(dto.studentId),
    });

    const { passwordHash: _, ...rest } = user.toObject();
    return rest as any;
  }

  /**
   * Validate credentials (email or studentCode),
   * then verify passwordHash with @node-rs/bcrypt
   */
  async validateUser(login: string, pass: string): Promise<UserDocument | null> {
    let user = await this.userModel.findOne({ email: login.toLowerCase(), isActive: true });
    if (!user && !/\S+@\S+\.\S+/.test(login)) {
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
    return this.userModel
      .findById(id)
      .populate('studentId', 'studentCode studentName')
      .select('-passwordHash')
      .exec();
  }

  async findAll(): Promise<Omit<User, 'passwordHash'>[]> {
    const users = await this.userModel.find().lean();
    // strip out passwordHash
    return users.map(u => {
      const { passwordHash, ...rest } = u;
      return rest as Omit<User, 'passwordHash'>;
    });
  }
}
