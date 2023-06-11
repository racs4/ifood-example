import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Model, Types } from 'mongoose';
import { Customer } from './entities/customer.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UserAddress } from './entities/user-adress.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  create(createCustomerDto: CreateCustomerDto) {
    const createdCustomer = new this.customerModel(createCustomerDto);
    return createdCustomer.save();
  }

  findOne(id: string) {
    return this.customerModel.findById(id).lean();
  }

  update(id: string, updateCustomerDto: UpdateCustomerDto) {
    return this.customerModel.updateOne({ _id: id }, updateCustomerDto).exec();
  }

  addAddresses(id: string, userAdresses: UserAddress[]) {
    return this.customerModel
      .updateOne({ _id: id }, { $push: { addresses: { $each: userAdresses } } })
      .exec();
  }

  async updateAdress(
    user_id: string,
    address_id: string,
    new_adress: Partial<UserAddress>,
  ) {
    const res = await this.customerModel
      .findOne(
        {
          _id: user_id,
        },
        {
          addresses: { $elemMatch: { _id: address_id } },
        },
      )
      .exec();
    if (!res || !res.addresses || !res.addresses.length) {
      throw new NotFoundException();
    }
    const address = res.addresses[0];
    const updatedAddress = { ...address.toObject(), ...new_adress };
    return this.customerModel
      .updateOne(
        { _id: user_id, 'addresses._id': address_id },
        {
          $set: {
            'addresses.$': { ...updatedAddress, _id: address_id },
          },
        },
      )
      .exec();
  }

  removeAddresses(id: string, userAddress: string) {
    return this.customerModel
      .updateOne(
        { _id: id },
        {
          $pull: {
            addresses: { _id: new Types.ObjectId(userAddress) },
          },
        },
      )
      .exec();
  }
}
