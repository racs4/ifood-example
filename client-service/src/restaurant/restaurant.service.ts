import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MenuItemDto } from './dto/menu-item.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
  ) {}

  create(createRestaurantDto: CreateRestaurantDto) {
    const createdRestaurant = new this.restaurantModel(createRestaurantDto);
    return createdRestaurant.save();
  }

  findAll() {
    return this.restaurantModel.find().lean();
  }

  findOne(id: string) {
    return this.restaurantModel.findById(id).lean();
  }

  update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    return this.restaurantModel
      .updateOne({ _id: id }, updateRestaurantDto)
      .exec();
  }

  addMenuItens(id: string, menuItems: MenuItemDto[]) {
    return this.restaurantModel
      .updateOne({ _id: id }, { $push: { menu: { $each: menuItems } } })
      .exec();
  }

  async updateMenuItem(
    userId: string,
    menuId: string,
    newMenuItem: Partial<MenuItemDto>,
  ) {
    const res = await this.restaurantModel
      .findOne(
        {
          _id: userId,
        },
        {
          menu: { $elemMatch: { _id: menuId } },
        },
      )
      .exec();
    if (!res || !res.menu || !res.menu.length) {
      throw new NotFoundException();
    }
    const menu = res.menu[0];
    const updatedMenu = { ...menu.toObject(), ...newMenuItem };
    return this.restaurantModel
      .updateOne(
        { _id: userId, 'menu._id': menuId },
        {
          $set: {
            'menu.$': { ...updatedMenu, _id: menuId },
          },
        },
      )
      .exec();
  }

  removeMenuItem(id: string, menuId: string) {
    return this.restaurantModel
      .updateOne(
        { _id: id },
        {
          $pull: {
            menu: { _id: new Types.ObjectId(menuId) },
          },
        },
      )
      .exec();
  }

  // remove(id: string) {
  //   return `This action removes a #${id} restaurant`;
  // }
}
