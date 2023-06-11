import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Services } from 'src/common/constants';
import { RestaurantController } from './restaurant.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: Services.CLIENT,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: 6379,
        },
      },
      {
        name: Services.AUTH,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [RestaurantController],
  providers: [],
})
export class RestaurantModule {}
