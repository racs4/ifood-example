import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ timestamps: true })
export class Customer {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  phone: string;
  @Prop({
    required: true,
    type: [
      {
        street: String,
        number: String,
        city: String,
        state: String,
        country: String,
      },
    ],
  })
  addresses: [Record<string, any>];
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
