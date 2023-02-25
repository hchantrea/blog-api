import { ResetPassword } from './../lib/models/reset-password';
import { EmailConfirm } from './../lib/models/email-confirm';
import { UserUpdate } from './../lib/models/user-update';
import { PaginationParameters } from './../lib/models/pagination-parameter';
import { RolesGuard } from './../lib/guards/roles.guard';
import { JwtAuthGuard } from './../lib/guards/jwt.auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserView } from '../lib/views/user.view';
import { UserCreate } from '../lib/models/user-create';
import { UserService } from './user.service';
import { Roles } from './../lib/decorator/roles.decorator';
import { Role } from './../lib/enum/role.enum';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ChangePassword } from '../lib/models/change-password';

@ApiBearerAuth()
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async signUp(@Body() userCreate: UserCreate) {
    const user = await this.userService.signUp(userCreate);
    return new UserView(user);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @Get()
  async getAll(@Query() { offset, limit }: PaginationParameters) {
    return this.userService.getAll(offset, limit);
  }

  @Get('/total')
  async getToal() {
    return this.userService.getTotal();
  }

  @Roles(Role.Admin, Role.Editor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiQuery({ name: 'email', required: true, type: 'string' })
  @Get('search')
  async getOneByEmail(@Query('email') email: string) {
    const userOne = await this.userService.getByEmail(email);
    return new UserView(userOne);
  }

  @Roles(Role.Admin, Role.Editor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiParam({ name: 'id', required: true, type: 'number' })
  @Get()
  async getOne(@Param('id') id: number) {
    const user = await this.userService.getOne(id);
    return new UserView(user);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiParam({ name: 'id', required: true, type: 'number' })
  @Patch()
  async update(@Param('id') id: number, @Body() userUpdate: UserUpdate) {
    const user = await this.userService.update(id, userUpdate);
    return new UserView(user);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiParam({ name: 'id', required: true, type: 'number' })
  @Delete()
  async delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }

  @Post('sendCode')
  async sendCode(@Body() userEmail: EmailConfirm) {
    return this.userService.sendCode(userEmail);
  }

  @Patch('resetPassword')
  async resetPassword(@Body() resetPassword: ResetPassword) {
    return this.userService.resetPassword(resetPassword);
  }

  @Roles(Role.Admin, Role.Editor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/changePassword')
  async changePassword(
    @Param('id') id: number,
    @Body() changePassword: ChangePassword,
  ) {
    const user = await this.userService.changePassword(id, changePassword);
    return new UserView(user);
  }
}
