import { ApiProperty } from '@nestjs/swagger';

export class UserAddress {
  @ApiProperty({ example: 'Rua das Flores' })
  street: string;
  @ApiProperty({ example: '123' })
  number: string;
  @ApiProperty({ example: 'Rio de Janeiro' })
  city: string;
  @ApiProperty({ example: 'RJ' })
  state: string;
  @ApiProperty({ example: 'Brasil' })
  country: string;
}
