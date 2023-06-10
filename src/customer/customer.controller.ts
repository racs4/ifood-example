import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/auth/role/role.enum';
import { Roles } from 'src/auth/role/role.decorator';
import { RolesGuard } from 'src/auth/role/role.guard';
import { UsersService } from 'src/users/users.service';
import { UserAddress } from './entities/user-adress.entity';

@ApiTags('customer')
@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Get some user by id, only used for debug' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }

  @ApiOperation({ summary: 'Register a new customer' })
  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    const res = (
      await this.customerService.create(createCustomerDto)
    ).toObject();
    await this.usersService.create({
      ...createCustomerDto,
      role: UserRole.CUSTOMER,
      user_id: res._id,
    });
    return {
      email: res.email,
      name: res.name,
      phone: res.phone,
      addresses: res.addresses,
    };
  }

  // @Get()
  // findAll() {
  //   return this.customerService.findAll();
  // }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the user by token' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @Get()
  findSelf(@Request() req) {
    if (req.user && req.user.user_id) {
      return this.customerService.findOne(req.user.user_id);
    } else {
      throw new NotFoundException('User not found');
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the user by token' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @Patch()
  update(@Body() updateCustomerDto: UpdateCustomerDto, @Request() req) {
    console.log(req.user);
    if (req.user && req.user.user_id) {
      return this.customerService.update(req.user.user_id, updateCustomerDto);
    } else {
      throw new NotFoundException('User not found');
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add one or more addresses to the user by token' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @Post('address')
  addAddress(@Body() addresses: UserAddress[], @Request() req) {
    if (req.user && req.user.user_id) {
      return this.customerService.addAddresses(req.user.user_id, addresses);
    } else {
      throw new NotFoundException('User not found');
    }
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update an user address by id (the user is taken from token)',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @Patch('address/:id')
  updateAdress(
    @Param('id') address_id: string,
    @Body() new_adress: UserAddress,
    @Request() req,
  ) {
    if (req.user && req.user.user_id) {
      return this.customerService.updateAdress(
        req.user.user_id,
        address_id,
        new_adress,
      );
    } else {
      throw new NotFoundException('User not found');
    }
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete an user address by id (the user is taken from token)',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @Delete('address/:id')
  deleteAddress(@Param('id') id: string, @Request() req) {
    console.log(id);
    if (req.user && req.user.user_id) {
      return this.customerService.removeAddresses(req.user.user_id, id);
    } else {
      throw new NotFoundException('User not found');
    }
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.customerService.remove(+id);
  // }
}
