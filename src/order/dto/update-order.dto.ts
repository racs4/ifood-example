import { PaymentMethod } from '../entities/payment.enum';

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
