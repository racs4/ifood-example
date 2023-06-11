import { Controller } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { MenuItemDto } from './dto/menu-item.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @MessagePattern({ cmd: 'find_one_restaurant' })
  findOne(data: { id: string }) {
    const { id } = data;
    return this.restaurantService.findOne(id);
  }

  @MessagePattern({ cmd: 'find_one_restaurant' })
  async create(createRestaurantDto: CreateRestaurantDto) {
    const res = (
      await this.restaurantService.create(createRestaurantDto)
    ).toObject();
    return {
      email: res.email,
      name: res.name,
      phone: res.phone,
      address: res.address,
      menu: res.menu,
    };
  }

  @MessagePattern({ cmd: 'find_self_restaurant' })
  findSelf(data: { user_id: string }) {
    const { user_id } = data;
    return this.restaurantService.findOne(user_id);
  }

  @MessagePattern({ cmd: 'update_restaurant' })
  update(data: { user_id: string; updateRestaurantDto: UpdateRestaurantDto }) {
    const { user_id, updateRestaurantDto } = data;
    return this.restaurantService.update(user_id, updateRestaurantDto);
  }

  @MessagePattern({ cmd: 'add_menu_item_restaurant' })
  addMenuItem(data: { user_id: string; menuItems: MenuItemDto[] }) {
    const { user_id, menuItems } = data;
    return this.restaurantService.addMenuItens(user_id, menuItems);
  }

  @MessagePattern({ cmd: 'update_menu_item_restaurant' })
  updateMenuItem(data: {
    user_id: string;
    menuId: string;
    newMenuItem: MenuItemDto;
  }) {
    const { user_id, menuId, newMenuItem } = data;
    return this.restaurantService.updateMenuItem(user_id, menuId, newMenuItem);
  }

  @MessagePattern({ cmd: 'delete_menu_item_restaurant' })
  deleteMenuItem(data: { user_id: string; id: string }) {
    const { user_id, id } = data;
    return this.restaurantService.removeMenuItem(user_id, id);
  }
}
