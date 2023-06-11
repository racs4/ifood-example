import { BadRequestException, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { OrderStatus } from './entities/order-status.enum';
import { OrderDocument, Order, OrderSchema } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Order.name,
        useFactory: () => {
          const schema = OrderSchema;
          schema.pre(
            'save',
            function (next: mongoose.CallbackWithoutResultAndOptionalError) {
              const order = this as OrderDocument;

              if (order.status !== OrderStatus.PENDING) {
                throw new BadRequestException('Order is not pending');
              }

              next();
            },
          );
          schema.pre(
            'updateOne',
            async function (
              next: mongoose.CallbackWithoutResultAndOptionalError,
            ) {
              const order = (await this.model
                .findOne(this.getQuery())
                .lean()) as Order;

              if (order.status !== OrderStatus.PENDING) {
                throw new BadRequestException('Order is not pending');
              }

              next();
            },
          );
          return schema;
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
