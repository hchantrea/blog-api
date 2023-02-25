import { PaginationParameters } from './../lib/models/pagination-parameter';
import { PostCreate, PostUpdate } from './../lib/models/post.create';
import { RolesGuard } from './../lib/guards/roles.guard';
import { JwtAuthGuard } from './../lib/guards/jwt.auth.guard';
import { Role } from './../lib/enum/role.enum';
import {
  Body,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Roles } from './../lib/decorator/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Post')
@Controller('posts')
export class PostController {
  constructor(
    private postService: PostService
  ) {}

  // @Roles(Role.Admin)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() postCreate: PostCreate) {
    return this.postService.create(postCreate);
  }

  // @Roles(Role.Admin, Role.Editor)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiQuery({ name: 'offset', required: false, type: 'number' })
  // @ApiQuery({ name: 'limit', required: false, type: 'number' })
  // @ApiQuery({ name: 'categoryId', required: false, type: 'number' })
  @Get()
  async getAll(
    @Query() { offset, limit }: PaginationParameters,
    @Query() query: { search?: string; categoryId?: number },
  ) {
    return this.postService.getAll(
      query.search,
      query.categoryId,
      offset,
      limit,
    );
  }

  @Get('/release')
  async getCategoryRelease(
    @Query() { offset, limit }: PaginationParameters,
    @Query() query: { search?: string; categoryId?: number },
  ) {
    return this.postService.getAllRelease(
      query.search,
      query.categoryId,
      offset,
      limit,
    );
  }

  @Get('/popular')
  async getPopular() {
    return this.postService.getPopular();
  }

  @Get('/totalViews')
  async getTotalView() {
    return this.postService.getTotalView();
  }

  // @Roles(Role.Admin, Role.Editor)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiParam({ name: 'id', required: true, type: 'number' })
  @Get(':id')
  async getOne(@Param('id') id: number) {
    return this.postService.getOne(id);
  }

  // @Roles(Role.Admin, Role.Editor)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiParam({ name: 'id', required: true, type: 'number' })
  @Patch(':id')
  async update(@Param('id') id: number, @Body() postUpdate: PostUpdate) {
    return this.postService.update(id, postUpdate);
  }

  // @Roles(Role.Admin, Role.Editor)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiParam({ name: 'id', required: true, type: 'number' })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.postService.delete(id);
  }

  @Delete()
  async batchDelete(@Query() query: { ids: string }) {
    return this.postService.batchDelete(
      query.ids.split(',').map((item) => +item),
    );
  }
}
