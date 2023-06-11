import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Services } from 'src/common/constants';
import { RestaurantController } from './restaurant.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: Services.CLIENT,
        transport: Transport.TCP,
        options: { port: +process.env.CUSTOMER_SERVICE_PORT || 3003 },
      },
      {
        name: Services.AUTH,
        transport: Transport.TCP,
        options: { port: +process.env.AUTH_SERVICE_PORT || 3002 },
      },
    ]),
  ],
  controllers: [RestaurantController],
  providers: [],
})
export class RestaurantModule {}
