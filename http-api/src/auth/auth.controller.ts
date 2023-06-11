import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Inject,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { Services } from 'src/common/constants';
import { ClientProxy } from '@nestjs/microservices';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(Services.AUTH) private authService: ClientProxy) {}

  @ApiOperation({ summary: 'Login a user' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() login: LoginDto, @Request() req) {
    return this.authService.send({ cmd: 'user_login' }, { user: req.user });
  }
}
