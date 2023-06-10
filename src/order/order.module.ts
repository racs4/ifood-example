import { BadRequestException, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderDocument, OrderSchema } from './entities/order.entity';
import mongoose from 'mongoose';
import { OrderStatus } from './entities/order-status.enum';
import { MenuItemDto } from './dto/menu-item.dto';

const middleware = async function (
  next: mongoose.CallbackWithoutResultAndOptionalError,
) {
  const order = this as OrderDocument;

  if (order.status !== OrderStatus.PENDING) {
    throw new BadRequestException('Order is not pending');
  }

  order.total = order.items.reduce(
    (acc: number, item: MenuItemDto) => acc + item.price * item.quantity,
    0,
  );

  next();
};

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Order.name,
        useFactory: () => {
          const schema = OrderSchema;
          schema.pre('save', middleware);
          schema.pre('findOneAndUpdate', middleware);
          schema.pre('updateOne', middleware);
          schema.pre('updateMany', middleware);
          return schema;
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
