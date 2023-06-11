import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  findAll() {
    return `This action returns all customer`;
  }

  async findOne(email: string) {
    const user = await this.userModel.findOne({ email: email }).lean();
    return user;
  }

  deactivate(id: number) {
    return `This action deactivate a #${id} customer`;
  }
}
