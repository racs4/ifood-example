import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Services } from 'src/common/constants';

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
  controllers: [CustomerController],
  providers: [],
})
export class CustomerModule {}
