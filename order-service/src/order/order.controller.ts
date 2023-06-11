import { Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { MenuItemDto } from './dto/menu-item.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern({ cmd: 'get_order' })
  findOne(data: { id: string }) {
    const { id } = data;
    return this.orderService.findOne(id);
  }

  @MessagePattern({ cmd: 'create_order' })
  create(data: { createOrderDto: CreateOrderDto; user_id: string }) {
    return this.orderService.create(data.createOrderDto, data.user_id);
  }

  @MessagePattern({ cmd: 'get_orders' })
  findAll(data: { user: any }) {
    return this.orderService.findAll(data.user);
  }

  @MessagePattern({ cmd: 'update_order' })
  update(data: {
    id: string;
    updateOrderDto: UpdateOrderDto;
    user_id: string;
  }) {
    const { id, updateOrderDto, user_id } = data;
    return this.orderService.update(id, updateOrderDto, user_id);
  }

  @MessagePattern({ cmd: 'cancel_order' })
  cancel(data: { id: string; user: any }) {
    const { id, user } = data;
    return this.orderService.cancel(id, user);
  }

  @MessagePattern({ cmd: 'approve_order' })
  approve(data: { id: string; user_id: string }) {
    const { id, user_id } = data;
    return this.orderService.approve(id, user_id);
  }

  @MessagePattern({ cmd: 'complete_order' })
  complete(data: { id: string; user_id: string }) {
    const { id, user_id } = data;
    return this.orderService.complete(id, user_id);
  }

  @MessagePattern({ cmd: 'add_items' })
  addItems(data: {
    orderId: string;
    user_id: string;
    menuItems: MenuItemDto[];
  }) {
    const { orderId, user_id, menuItems } = data;
    return this.orderService.addItems(orderId, user_id, menuItems);
  }

  @MessagePattern({ cmd: 'update_item' })
  updateMenuItem(data: {
    orderId: string;
    user_id: string;
    menuId: string;
    newQuantity: number;
  }) {
    const { orderId, user_id, menuId, newQuantity } = data;
    return this.orderService.updateItem(orderId, user_id, menuId, newQuantity);
  }

  @MessagePattern({ cmd: 'delete_item' })
  deleteMenuItem(data: { id: string; orderId: string; user_id: string }) {
    const { orderId, user_id, id } = data;
    return this.orderService.removeItem(orderId, user_id, id);
  }
}
