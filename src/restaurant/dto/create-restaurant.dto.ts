import { ApiProperty } from '@nestjs/swagger';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Restaurant John Doe' })
  name: string;
  @ApiProperty({ example: 'restaurant.doe@email.com' })
  email: string;
  @ApiProperty({ example: '12345678' })
  password: string;
  @ApiProperty({ example: '999999999' })
  phone: string;
  @ApiProperty({
    example: {
      street: 'Rua dos Bobos',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brazil',
    },
  })
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
  @ApiProperty({
    example: [
      {
        name: 'Pizza',
        price: 10,
        description: 'A nice pizza',
      },
    ],
  })
  menu: {
    name: string;
    price: number;
    description: string;
  }[];
}
