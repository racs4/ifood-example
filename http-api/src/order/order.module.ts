import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Services } from 'src/common/constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: Services.ORDER,
        transport: Transport.TCP,
        options: { port: +process.env.AUTH_SERVICE_PORT || 3001 },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [],
})
export class OrderModule {}
