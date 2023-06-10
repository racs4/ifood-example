import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { OrderStatus } from './order-status.enum';
import { PaymentMethod } from './payment.enum';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, type: SchemaTypes.ObjectId })
  restaurantId: Types.ObjectId;
  @Prop({ required: true, type: SchemaTypes.ObjectId })
  customerId: Types.ObjectId;
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
        quantity: Number,
      },
    ],
  })
  items: Record<string, any>;
  @Prop({ required: true })
  total: number;
  @Prop({ required: true })
  status: OrderStatus;
  @Prop({ required: true })
  paymentMethod: PaymentMethod;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
