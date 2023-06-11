import { PaymentMethod } from './payment.dto';

export class UpdateOrderDto {
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    country: string;
  };
  paymentMethod: PaymentMethod;
}
