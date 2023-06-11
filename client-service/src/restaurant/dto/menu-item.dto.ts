import { ApiProperty } from '@nestjs/swagger';

export class MenuItemDto {
  @ApiProperty({ example: 'Pizza' })
  name: string;
  @ApiProperty({ example: 25 })
  price: number;
  @ApiProperty({ example: 'Pizza de calabresa' })
  description: string;
}
