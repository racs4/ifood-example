import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { UserRole } from 'src/auth/role/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'password' })
  password: string;
  @ApiProperty({ example: 'email@email.com' })
  email: string;
  @ApiProperty({ example: 'restaurant' })
  role: UserRole;
  @ApiProperty({ example: 'user_id' })
  user_id: Types.ObjectId;
}
