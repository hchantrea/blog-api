import { UserLogin } from './../lib/models/user-login';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findUerByEmail(username);
    const passwordMatchers = await bcrypt.compare(password, user.password);

    if (user && passwordMatchers) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserLogin) {
    const userTobeLogin = await this.userService.findUerByEmail(user.username);
    const payload = { username: user.username, sub: userTobeLogin.id };
    return {
      accessToken: this.jwtService.sign(payload),
      authorizationType: 'Bearer',
    };
  }
}
