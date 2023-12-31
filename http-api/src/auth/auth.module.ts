import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Services, jwtConstants } from 'src/common/constants';
import { LocalStrategy } from 'src/common/strategies/local.strategy';
import { JwtStrategy } from 'src/common/strategies/jwt.strategies';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    ClientsModule.register([
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
  controllers: [AuthController],
  providers: [LocalStrategy, JwtStrategy],
  exports: [],
})
export class AuthModule {}
