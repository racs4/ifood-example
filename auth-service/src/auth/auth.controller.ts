import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  // @Message
  @MessagePattern({ cmd: 'user_login' })
  async login(data: { user: any }) {
    const user = data.user;
    return this.authService.login(user);
  }

  @MessagePattern({ cmd: 'validate_login' })
  async validate(data: LoginDto) {
    const { email, password } = data;
    return this.authService.validateUser(email, password);
  }

  @MessagePattern({ cmd: 'register' })
  async register(data: CreateUserDto) {
    return this.usersService.create(data);
  }
}
