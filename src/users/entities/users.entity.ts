import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { UserRole } from 'src/auth/role/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  email: string;
  @Prop()
  @Exclude({ toPlainOnly: true })
  password: string;
  @Prop({ required: true })
  role: UserRole;
  @Prop({ type: SchemaTypes.ObjectId })
  user_id: Types.ObjectId;
  @Prop({ required: true, default: true })
  active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
