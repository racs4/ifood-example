import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OrderStatus } from './entities/order-status.enum';
import { MenuItemDto } from './dto/menu-item.dto';
import { UserRole } from './entities/user-role.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  create(createOrderDto: CreateOrderDto, customerId: string) {
    const { restaurantId, address, items, paymentMethod } = createOrderDto;

    const order = new this.orderModel({
      restaurantId,
      address,
      items,
      paymentMethod,
      customerId,
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

  findOne(id: string) {
    return this.orderModel
      .findOne({
        _id: id,
      })
      .lean();
  }

  update(id: string, updateOrderDto: UpdateOrderDto, customerId: string) {
    return this.orderModel
      .updateOne({ _id: id, customerId }, updateOrderDto)
      .lean();
  }

  async removeItem(orderId: string, customerId: string, itemId: string) {
    return this.orderModel
      .updateOne(
        { _id: orderId, customerId },
        {
          $pull: {
            items: { _id: new Types.ObjectId(itemId) },
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
        { _id: orderId, customerId: customerId, 'items._id': itemId },
        {
          $set: {
            'items.$': { ...updatedItem, _id: itemId },
          },
        },
      )
      .exec();
  }

  addItems(orderId: string, customerId: string, menuItems: MenuItemDto[]) {
    return this.orderModel
      .updateOne(
        { _id: orderId, customerId },
        { $push: { items: { $each: menuItems } } },
      )
      .exec();
  }

  approve(orderId: string, restaurantId: string) {
    return this.orderModel.updateOne(
      { _id: orderId, restaurantId },
      { status: OrderStatus.APPROVED },
    );
  }

  complete(orderId: string, restaurantId: string) {
    return this.orderModel.updateOne(
      { _id: orderId, restaurantId },
      { status: OrderStatus.COMPLETED },
    );
  }

  cancel(orderId: string, user) {
    if (user.role === UserRole.CUSTOMER) {
      return this.orderModel.updateOne(
        { _id: orderId, customerId: user.user_id },
        { status: OrderStatus.CANCELLED },
      );
    }
    if (user.role === UserRole.RESTAURANT) {
      return this.orderModel.updateOne(
        { _id: orderId, restaurantId: user.user_id },
        { status: OrderStatus.CANCELLED },
      );
    }
  }
}
