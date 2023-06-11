import { ApiProperty } from '@nestjs/swagger';

export class UpdateRestaurantDto {
  @ApiProperty({ example: 'Restaurant John Doe 2' })
  name: string;
  @ApiProperty({ example: '88888888' })
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
}
