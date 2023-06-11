import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from './payment.dto';

export class CreateOrderDto {
  @ApiProperty({ example: '64840aac1195e9ef6dbfaced' })
  restaurantId: string;
  @ApiProperty({
    example: {
      street: 'Rua dos Alfeneiros',
      number: '4',
      city: 'Londres',
      state: 'Inglaterra',
      country: 'Reino Unido',
    },
  })
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    country: string;
  };
  @ApiProperty({
    example: [
      {
        name: 'Pizza',
        price: 10,
        description: 'Cerveja amanteigada de 500ml',
        quantity: 2,
      },
    ],
  })
  items: [
    {
      name: string;
      price: number;
      description: string;
      quantity: number;
    },
  ];
  @ApiProperty({ example: PaymentMethod.CREDIT_CARD })
  paymentMethod: PaymentMethod;
}
