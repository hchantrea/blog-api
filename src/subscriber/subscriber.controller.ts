import { Subscriber } from './../lib/entitys/subscriber.entity';
import { PaginationParameters } from './../lib/models/pagination-parameter';
import { SubscriberView } from './../lib/views/subscriber.view';
import { SubscriberCreate } from './../lib/models/subcriber.create';
import { RolesGuard } from './../lib/guards/roles.guard';
import { JwtAuthGuard } from './../lib/guards/jwt.auth.guard';
import { Role } from './../lib/enum/role.enum';
import { SubscriberService } from './subscriber.service';
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
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from './../lib/decorator/roles.decorator';

@ApiBearerAuth()
@ApiTags('Subscriber')
@Controller('subscribers')
export class SubscriberController {
  constructor(private subscriberService: SubscriberService) {}

  @Post()
  async signUp(@Body() subscriberCreate: SubscriberCreate) {
    const subscriber = await this.subscriberService.create(subscriberCreate);
    return new SubscriberView(subscriber);
  }

  // @Roles(Role.Admin)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiQuery({ name: 'offset', required: false, type: 'number' })
  // @ApiQuery({ name: 'limit', required: false, type: 'number' })
  // @ApiQuery({ name: 'username', required: false, type: 'string' })
  // @ApiQuery({ name: 'email', required: false, type: 'string' })
  @Get()
  async getAll(
    @Query() { offset, limit }: PaginationParameters,
    @Query() { email }: Subscriber,
  ) {
    return await this.subscriberService.getAll(email, offset, limit);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiParam({ name: 'id', required: true, type: 'number' })
  @Get(':id')
  async getOne(@Param('id') id: number) {
    const subscriber = await this.subscriberService.getOne(id);
    return new SubscriberView(subscriber);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiParam({ name: 'id', required: true, type: 'number' })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() subscriberUpdate: SubscriberCreate,
  ) {
    const subscriber = await this.subscriberService.update(
      id,
      subscriberUpdate,
    );
    return new SubscriberView(subscriber);
  }

  @Roles(Role.Admin, Role.Editor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiParam({ name: 'id', required: true, type: 'number' })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.subscriberService.delete(id);
  }
}
