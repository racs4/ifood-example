import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OrderStatus } from './entities/order-status.enum';
import { UserRole } from 'src/auth/role/role.enum';
import { MenuItemDto } from './dto/menu-item.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  create(createOrderDto: CreateOrderDto, customerId: string) {
    const { restaurantId, address, items, paymentMethod } = createOrderDto;
    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const order = new this.orderModel({
      restaurantId,
      address,
      items,
      paymentMethod,
      customerId,
      total,
      status: OrderStatus.PENDING,
    });
    return order.save();
  }

  findAll(user) {
    if (user.role === UserRole.CUSTOMER) {
      return this.orderModel.find({ customerId: user.user_id }).lean();
    }
    if (user.role === UserRole.RESTAURANT) {
      return this.orderModel.find({ restaurantId: user.user_id }).lean();
    }
    throw new NotFoundException('User not found');
  }

  findOne(id: number) {
    return this.orderModel.findById(id).lean();
  }

  update(id: string, updateOrderDto: UpdateOrderDto, customerId: string) {
    if (!this.isOrderPending(id)) {
      throw new BadRequestException('Order is not pending');
    }

    return this.orderModel
      .findOneAndUpdate({ _id: id, customerId }, updateOrderDto)
      .lean();
  }

  removeItem(orderId: string, customerId: string, itemId: string) {
    if (!this.isOrderPending(orderId)) {
      throw new BadRequestException('Order is not pending');
    }

    return this.orderModel
      .updateOne(
        { _id: orderId, customerId },
        {
          $pull: {
            menu: { _id: new Types.ObjectId(itemId) },
          },
        },
      )
      .exec();
  }

  async updateItem(
    orderId: string,
    customerId: string,
    itemId: string,
    newQuantity: number,
  ) {
    if (!this.isOrderPending(orderId)) {
      throw new BadRequestException('Order is not pending');
    }

    const res = await this.orderModel
      .findOne(
        {
          _id: orderId,
          customerId: customerId,
        },
        {
          items: { $elemMatch: { _id: itemId } },
        },
      )
      .exec();
    if (!res || !res.items || !res.items.length) {
      throw new NotFoundException('Item not found');
    }
    const item = res.items[0];
    const updatedItem = { ...item.toObject(), quantity: newQuantity };
    return this.orderModel
      .updateOne(
        { _id: orderId, customerId: customerId },
        {
          $set: {
            'items.$': { ...updatedItem, _id: itemId },
          },
        },
      )
      .exec();
  }

  addItems(orderId: string, customerId: string, menuItems: MenuItemDto[]) {
    if (!this.isOrderPending(orderId)) {
      throw new BadRequestException('Order is not pending');
    }

    return this.orderModel
      .updateOne(
        { _id: orderId, customerId },
        { $push: { menu: { $each: menuItems } } },
      )
      .exec();
  }

  approve(orderId: string, restaurantId: string) {
    if (!this.isOrderPending(orderId)) {
      throw new BadRequestException('Order is not pending');
    }

    return this.orderModel.findOneAndUpdate(
      { _id: orderId, restaurantId },
      { status: OrderStatus.APPROVED },
    );
  }

  complete(orderId: string, restaurantId: string) {
    if (!this.isOrderPending(orderId)) {
      throw new BadRequestException('Order is not pending');
    }

    return this.orderModel.findOneAndUpdate(
      { _id: orderId, restaurantId },
      { status: OrderStatus.COMPLETED },
    );
  }

  cancel(orderId: string, user) {
    if (!this.isOrderPending(orderId)) {
      throw new BadRequestException('Order is not pending');
    }

    if (user.role === UserRole.CUSTOMER) {
      return this.orderModel.findOneAndUpdate(
        { _id: orderId, customerId: user.user_id },
        { status: OrderStatus.CANCELLED },
      );
    }
    if (user.role === UserRole.RESTAURANT) {
      return this.orderModel.findOneAndUpdate(
        { _id: orderId, restaurantId: user.user_id },
        { status: OrderStatus.CANCELLED },
      );
    }
  }

  async isOrderPending(orderId: string): Promise<boolean> {
    return (
      (await this.orderModel.findById(orderId).lean()).status ===
      OrderStatus.PENDING
    );
  }
}
