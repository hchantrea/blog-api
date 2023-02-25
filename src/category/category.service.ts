import { CategoryView } from './../lib/views/category.view';
import { PaginationDto } from './../lib/models/pagination-dto';
import {
  CategoryCreate,
  CategoryUpdate,
} from './../lib/models/category-create';
import { DataSource, Repository } from 'typeorm';
import { Category } from './../lib/entitys/category.entity';
import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    private dataSource: DataSource,
  ) {}

  async create(categoryCreate: CategoryCreate) {
    const categoryName = await this.findName(categoryCreate.name);
    if (categoryName) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'name already exist',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.categoryRepo.save(this.categoryRepo.create(categoryCreate));
  }

  async getAll(
    search?: string,
    offset?: number,
    limit?: number,
  ): Promise<PaginationDto<CategoryView>> {
    let query = this.dataSource
      .getRepository(Category)
      .createQueryBuilder('categories');
    if (search) {
      query.where('name ILIKE :name', { name: `%${search}%` });
    }
    query.addOrderBy('updated_at', 'DESC').limit(limit).offset(offset);

    const categories = await query.getMany();
    const totalCount = await this.categoryRepo.count();
    const view = categories.map((data) => new CategoryView(data));
    return new PaginationDto(
      view,
      Number(limit),
      offset === undefined ? 0 : Number(offset),
      totalCount,
    );
  }

  async getOne(id: number) {
    const category = await this.categoryRepo.findOneBy({ id: id });
    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }
    return category;
  }

  async update(id: number, categoryUpdate: CategoryUpdate) {
    const category = await this.categoryRepo.findOneBy({ id: id });

    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }

    if (category.name === categoryUpdate.name) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'name already exist',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    category.name = categoryUpdate.name;
    category.status = categoryUpdate.status;
    category.updatedAt = new Date();
    await this.categoryRepo.update(id, category);
    return await this.categoryRepo.findOneBy({ id: id });
  }

  async delete(id: number) {
    const category = await this.categoryRepo.findOneBy({ id: id });
    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }
    return this.categoryRepo.delete({ id: id });
  }

  async batchDelete(ids: number[]) {
    let query = this.dataSource
      .getRepository(Category)
      .createQueryBuilder('categories')
      .select('categories.id');

    for (const id of ids) {
      const category = await query.where('id = :id', { id: id }).getOne();
      if (!category) {
        throw new NotFoundException(`Category ${id} not found`);
      }
      return this.categoryRepo.delete({ id: category.id });
    }
  }

  private findName(name: string) {
    return this.categoryRepo.findOneBy({ name: name });
  }
}
