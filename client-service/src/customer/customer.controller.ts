import { Controller } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UserAddress } from './entities/user-adress.entity';
import { MessagePattern } from '@nestjs/microservices';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @MessagePattern({ cmd: 'find_one_customer' })
  findOne(data: { id: string }) {
    const { id } = data;
    return this.customerService.findOne(id);
  }

  @MessagePattern({ cmd: 'create_customer' })
  async create(createCustomerDto: CreateCustomerDto) {
    const res = (
      await this.customerService.create(createCustomerDto)
    ).toObject();
    return {
      email: res.email,
      name: res.name,
      phone: res.phone,
      addresses: res.addresses,
    };
  }

  @MessagePattern({ cmd: 'find_self_customer' })
  findSelf(data: { user_id: string }) {
    const { user_id } = data;
    return this.customerService.findOne(user_id);
  }

  @MessagePattern({ cmd: 'update_customer' })
  update(data: { user_id: string; updateCustomerDto: UpdateCustomerDto }) {
    const { user_id, updateCustomerDto } = data;
    return this.customerService.update(user_id, updateCustomerDto);
  }

  @MessagePattern({ cmd: 'add_address_customer' })
  addAddresses(data: { user_id: string; addresses: UserAddress[] }) {
    const { user_id, addresses } = data;
    return this.customerService.addAddresses(user_id, addresses);
  }

  @MessagePattern({ cmd: 'update_address_customer' })
  updateAdress(data: {
    user_id: string;
    address_id: string;
    new_adress: UserAddress;
  }) {
    const { user_id, address_id, new_adress } = data;
    return this.customerService.updateAdress(user_id, address_id, new_adress);
  }

  @MessagePattern({ cmd: 'delete_address_customer' })
  deleteAddress(data: { user_id: string; address_id: string }) {
    const { user_id, address_id } = data;
    return this.customerService.removeAddresses(user_id, address_id);
  }
}
