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
  Inject,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/role/role.decorator';
import { UserRole } from 'src/common/role/role.enum';
import { RolesGuard } from 'src/common/role/role.guard';
import { Services } from 'src/common/constants';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CustomerAddressDto } from './dto/address.dto';

@ApiTags('customer')
@Controller('customer')
export class CustomerController {
  constructor(
    @Inject(Services.CLIENT) private customerService: ClientProxy,
    @Inject(Services.AUTH) private authService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Get some user by id, only used for debug' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return firstValueFrom(
      this.customerService.send({ cmd: 'find_one_customer' }, { id }),
    );
  }

  @ApiOperation({ summary: 'Register a new customer' })
  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    const res = await firstValueFrom(
      this.customerService.send({ cmd: 'create_customer' }, createCustomerDto),
    );
    await firstValueFrom(
      this.authService.send(
        { cmd: 'register' },
        {
          ...createCustomerDto,
          role: UserRole.CUSTOMER,
          user_id: res._id,
        },
      ),
    );
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
    if (!req || !req.user || !req.user.user_id) {
      throw new NotFoundException('Customer not found');
    }
    return this.customerService.send(
      { cmd: 'find_self_customer' },
      { user_id: req.user.user_id },
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the user by token' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @Patch()
  update(@Body() updateCustomerDto: UpdateCustomerDto, @Request() req) {
    if (!req || !req.user || !req.user.user_id) {
      throw new NotFoundException('Customer not found');
    }
    return this.customerService.send(
      { cmd: 'update_customer' },
      { user_id: req.user.user_id, updateCustomerDto },
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add one or more addresses to the user by token' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @Post('address')
  addAddress(@Body() addresses: CustomerAddressDto[], @Request() req) {
    if (!req || !req.user || !req.user.user_id) {
      throw new NotFoundException('Customer not found');
    }
    return this.customerService.send(
      { cmd: 'add_address_customer' },
      { user_id: req.user.user_id, addresses },
    );
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
    @Body() new_adress: CustomerAddressDto,
    @Request() req,
  ) {
    if (!req || !req.user || !req.user.user_id) {
      throw new NotFoundException('Customer not found');
    }

    return this.customerService.send(
      { cmd: 'update_address_customer' },
      { user_id: req.user.user_id, address_id, new_adress },
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete an user address by id (the user is taken from token)',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @Delete('address/:id')
  deleteAddress(@Param('id') id: string, @Request() req) {
    if (!req || !req.user || !req.user.user_id) {
      throw new NotFoundException('Customer not found');
    }

    return this.customerService.send(
      { cmd: 'delete_address_customer' },
      { user_id: req.user.user_id, address_id: id },
    );
  }
}
