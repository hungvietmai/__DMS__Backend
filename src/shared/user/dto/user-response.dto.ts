import type { UserRole } from '../schemas/user.schema.js';

export class UserResponseDto {
  id!: string;
  email!: string;
  studentId!: string;
  role!: UserRole;
  createdAt!: Date;
  updatedAt!: Date;
}
