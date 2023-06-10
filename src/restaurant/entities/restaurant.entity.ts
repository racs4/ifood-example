import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RestaurantDocument = HydratedDocument<Restaurant>;

@Schema({ timestamps: true })
export class Restaurant {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  phone: string;
  @Prop({
    required: true,
    type: {
      street: String,
      number: String,
      city: String,
      state: String,
      country: String,
    },
  })
  address: Record<string, any>;
  @Prop({
    required: true,
    type: [
      {
        name: String,
        price: Number,
        description: String,
      },
    ],
  })
  menu: Record<string, any>;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
