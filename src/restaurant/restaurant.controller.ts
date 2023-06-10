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
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/role/role.decorator';
import { UserRole } from 'src/auth/role/role.enum';
import { RolesGuard } from 'src/auth/role/role.guard';
import { UsersService } from 'src/users/users.service';
import { MenuItemDto } from './dto/menu-item.dto';

@ApiTags('restaurant')
@Controller('restaurant')
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Get some restaurant by id, only used for debug' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantService.findOne(+id);
  }

  @ApiOperation({ summary: 'Register a new restaurant' })
  @Post()
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    const res = (
      await this.restaurantService.create(createRestaurantDto)
    ).toObject();
    await this.usersService.create({
      ...createRestaurantDto,
      role: UserRole.RESTAURANT,
      user_id: res._id,
    });
    return {
      email: res.email,
      name: res.name,
      phone: res.phone,
      address: res.address,
      menu: res.menu,
    };
  }

  // @Get()
  // findAll() {
  //   return this.restaurantService.findAll();
  // }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the restaurant by token' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  @Get()
  findSelf(@Request() req) {
    if (req.user && req.user.user_id) {
      return this.restaurantService.findOne(req.user.user_id);
    } else {
      throw new NotFoundException('Restaurant not found');
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the restaurant by token' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  @Patch()
  update(@Body() updateRestaurantDto: UpdateRestaurantDto, @Request() req) {
    console.log(req.user);
    if (req.user && req.user.user_id) {
      return this.restaurantService.update(
        req.user.user_id,
        updateRestaurantDto,
      );
    } else {
      throw new NotFoundException('Restaurant not found');
    }
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add one or more menu items to the restaurant by token',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  @Post('menu-item')
  addMenuItem(@Body() menuItems: MenuItemDto[], @Request() req) {
    if (req.user && req.user.user_id) {
      return this.restaurantService.addMenuItens(req.user.user_id, menuItems);
    } else {
      throw new NotFoundException('Restaurant not found');
    }
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
    if (req.user && req.user.user_id) {
      return this.restaurantService.updateMenuItem(
        req.user.user_id,
        menuId,
        newMenuItem,
      );
    } else {
      throw new NotFoundException('Restaurant not found');
    }
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
    console.log(id);
    if (req.user && req.user.user_id) {
      return this.restaurantService.removeMenuItem(req.user.user_id, id);
    } else {
      throw new NotFoundException('Restaurant not found');
    }
  }
}
