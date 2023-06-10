import { PaymentMethod } from '../entities/payment.enum';

export class CreateOrderDto {
  restaurantId: string;
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    country: string;
  };
  items: [
    {
      name: string;
      price: number;
      description: string;
      quantity: number;
    },
  ];
  paymentMethod: PaymentMethod;
}
