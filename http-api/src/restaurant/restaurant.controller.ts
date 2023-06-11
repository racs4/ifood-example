import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  Request,
  Inject,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MenuItemDto } from './dto/menu-item.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Services } from 'src/common/constants';
import { UserRole } from 'src/common/role/role.enum';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/role/role.decorator';
import { RolesGuard } from 'src/common/role/role.guard';

@ApiTags('restaurant')
@Controller('restaurant')
export class RestaurantController {
  constructor(
    @Inject(Services.CLIENT) private restaurantService: ClientProxy,
    @Inject(Services.AUTH) private authService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Get some restaurant by id, only used for debug' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantService.send({ cmd: 'find_one_restaurant' }, { id });
  }

  @ApiOperation({ summary: 'Register a new restaurant' })
  @Post()
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    const res = await firstValueFrom(
      this.restaurantService.send(
        { cmd: 'create_restaurant' },
        createRestaurantDto,
      ),
    );
    await firstValueFrom(
      this.authService.send(
        { cmd: 'register' },
        {
          ...createRestaurantDto,
          role: UserRole.RESTAURANT,
          user_id: res.id,
        },
      ),
    );
    return {
      email: res.email,
      name: res.name,
      phone: res.phone,
      address: res.address,
      menu: res.menu,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the restaurant by token' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  @Get()
  findSelf(@Request() req) {
    if (!req || !req.user || !req.user.user_id) {
      throw new NotFoundException('Restaurant not found');
    }

    return this.restaurantService.send(
      { cmd: 'find_self_restaurant' },
      { user_id: req.user.user_id },
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the restaurant by token' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  @Patch()
  update(@Body() updateRestaurantDto: UpdateRestaurantDto, @Request() req) {
    if (!req || !req.user || !req.user.user_id) {
      throw new NotFoundException('Restaurant not found');
    }
    return this.restaurantService.send(
      { cmd: 'update_restaurant' },
      { user_id: req.user.user_id, updateRestaurantDto },
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add one or more menu items to the restaurant by token',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  @Post('menu-item')
  addMenuItem(@Body() menuItems: MenuItemDto[], @Request() req) {
    if (!req || !req.user || !req.user.user_id) {
      throw new NotFoundException('Restaurant not found');
    }

    return this.restaurantService.send(
      { cmd: 'add_menu_item_restaurant' },
      { user_id: req.user.user_id, menuItems },
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Update a restaurant menu item by id (the restaurant is taken from token)',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  @Patch('menu-item/:id')
  updateMenuItem(
    @Param('id') menuId: string,
    @Body() newMenuItem: MenuItemDto,
    @Request() req,
  ) {
    if (!req || !req.user || !req.user.user_id) {
      throw new NotFoundException('Restaurant not found');
    }
    return this.restaurantService.send(
      { cmd: 'update_menu_item_restaurant' },
      { user_id: req.user.user_id, menuId, newMenuItem },
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Delete a restaurant menu item by id (the restaurant is taken from token)',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  @Delete('menu-item/:id')
  deleteMenuItem(@Param('id') id: string, @Request() req) {
    if (!req || !req.user || !req.user.user_id) {
      throw new NotFoundException('Restaurant not found');
    }
    return this.restaurantService.send(
      { cmd: 'delete_menu_item_restaurant' },
      { user_id: req.user.user_id, id },
    );
  }
}
