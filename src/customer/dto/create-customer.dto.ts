import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'John Doe' })
  name: string;
  @ApiProperty({ example: 'john.doe@email.com' })
  email: string;
  @ApiProperty({ example: '12345678' })
  password: string;
  @ApiProperty({ example: '999999999' })
  phone: string;
  @ApiProperty({
    example: [
      {
        street: 'Rua dos Bobos',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brazil',
      },
    ],
  })
  addresses: {
    street: string;
    city: string;
    state: string;
    country: string;
  }[];
}
