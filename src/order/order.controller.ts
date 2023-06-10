import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/role/role.decorator';
import { UserRole } from 'src/auth/role/role.enum';
import { RolesGuard } from 'src/auth/role/role.guard';
import { MenuItemDto } from './dto/menu-item.dto';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Get some order by id, only used for debug' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an order' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    if (!req || !req.user || !req.user.user_id) {
      throw new NotFoundException('User not found');
    }
    return this.orderService.create(createOrderDto, req.user.user_id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get orders by user token' })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    if (!req || !req.user) {
      throw new NotFoundException('User not found');
    }
    return this.orderService.findAll(req.user);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update order by user token (only works if its pending)',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Request() req,
  ) {
    if (!req || !req.user) {
      throw new NotFoundException('Customer not found');
    }
    return this.orderService.update(id, updateOrderDto, req.user.user_id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cancel an order by user token (only works if its pending)',
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Request() req) {
    if (!req || !req.user || !req.user.user_id) {
      throw new NotFoundException('User not found');
    }
    return this.orderService.cancel(id, req.user);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Approve an order by user token (only works if its pending, the user must be a restaurant)',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  @Patch(':id/approve')
  approve(@Param('id') id: string, @Request() req) {
    if (!req || !req.user || !req.user.user_id) {
      throw new NotFoundException('Restaurant not found');
    }
    return this.orderService.approve(id, req.user.user_id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Approve an order by user token (only works if its pending, the user must be a restaurant)',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  @Patch(':id/complete')
  complete(@Param('id') id: string, @Request() req) {
    if (!req || !req.user || !req.user.user_id) {
      throw new NotFoundException('Restaurant not found');
    }
    return this.orderService.complete(id, req.user.user_id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add one or more menu items to the order by token',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @Post(':order/menu-item')
  addItems(
    @Param('order') orderId: string,
    @Body() menuItems: MenuItemDto[],
    @Request() req,
  ) {
    if (!req || !req.user || !req.user.user_id) {
      throw new NotFoundException('Restaurant not found');
    }

    return this.orderService.addItems(orderId, req.user.user_id, menuItems);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update an order quantity by id (the user is taken from token)',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @Patch(':order/menu-item/:id')
  updateMenuItem(
    @Param('order') orderId: string,
    @Param('id') menuId: string,
    @Body() newQuantity: { new_quantity: number },
    @Request() req,
  ) {
    if (!req || !req.user || !req.user.user_id) {
      throw new NotFoundException('Customer not found');
    }
    if (newQuantity.new_quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    return this.orderService.updateItem(
      orderId,
      req.user.user_id,
      menuId,
      newQuantity.new_quantity,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a menu item by id (the user is taken from token)',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @Delete(':order/menu-item/:id')
  deleteMenuItem(
    @Param('order') orderId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    if (!req || !req.user || !req.user.user_id) {
      throw new NotFoundException('Customer not found');
    }
    return this.orderService.removeItem(orderId, req.user.user_id, id);
  }
}
