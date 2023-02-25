import { UserLogin } from './../lib/models/user-login';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../lib/guards/local-auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Access Token')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() userLogin: UserLogin) {
    return this.authService.login(userLogin);
  }
}
