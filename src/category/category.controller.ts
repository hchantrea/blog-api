import { PaginationParameters } from './../lib/models/pagination-parameter';
import { CategoryView } from './../lib/views/category.view';
import { CategoryCreate, CategoryUpdate } from './../lib/models/category-create';
import { CategoryService } from './category.service';
import { RolesGuard } from './../lib/guards/roles.guard';
import { JwtAuthGuard } from './../lib/guards/jwt.auth.guard';
import { Role } from './../lib/enum/role.enum';
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
import { Roles } from './../lib/decorator/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Category')
@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  // @Roles(Role.Admin)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() categoryCreate: CategoryCreate) {
    const category = await this.categoryService.create(categoryCreate);
    return new CategoryView(category);
  }

  // @Roles(Role.Admin)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiQuery({ name: 'offset', required: false, type: 'number' })
  // @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @Get()
  getAll(
    @Query() { offset, limit }: PaginationParameters,
    @Query() query: { search?: string },
  ) {
    return this.categoryService.getAll(query.search, offset, limit);
  }

  // @Roles(Role.Admin, Role.Editor)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiParam({ name: 'id', required: true, type: 'number', example: '1' })
  @Get(':id')
  async getOne(@Param('id') id: number) {
    const category = await this.categoryService.getOne(id);
    return new CategoryView(category);
  }

  // @Roles(Role.Admin)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiParam({ name: 'id', required: true, type: 'number', example: '1' })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() categoryCreate: CategoryUpdate,
  ) {
    const user = await this.categoryService.update(id, categoryCreate);
    return new CategoryView(user);
  }

  // @Roles(Role.Admin)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiParam({ name: 'id', required: true, type: 'number', example: '1' })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    this.categoryService.delete(id);
  }
}
