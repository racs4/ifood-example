import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema } from './entities/users.entity';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre(
            'save',
            async function (
              next: mongoose.CallbackWithoutResultAndOptionalError,
            ) {
              const user = this as UserDocument;
              if (user.isModified('password')) {
                const salt = await bcrypt.genSalt();
                this.password = await bcrypt.hash(this.password, salt);
              }
              next();
            },
          );
          return schema;
        },
      },
    ]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
