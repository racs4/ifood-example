import { ApiProperty } from '@nestjs/swagger';

export class UpdateCustomerDto {
  @ApiProperty({ example: 'Doe John' })
  name: string;
  @ApiProperty({ example: '888888888' })
  phone: string;
}
