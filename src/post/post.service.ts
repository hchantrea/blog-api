import { PaginationDto } from './../lib/models/pagination-dto';
import { CategoryService } from './../category/category.service';
import { PostView } from './../lib/views/post.view';
import { PostCreate, PostUpdate } from './../lib/models/post.create';
import { DataSource, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './../lib/entitys/post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    private dataSource: DataSource,
    private categoryService: CategoryService,
  ) {}

  async create(postCreate: PostCreate): Promise<PostView> {
    const category = await this.categoryService.getOne(postCreate.categoryId);
    if (!category) {
      throw new NotFoundException(
        `Category ${postCreate.categoryId} not found`,
      );
    }
    const createPost = this.postRepo.create(postCreate);
    const newPost = Object.assign({}, createPost, { category: category })
    const post = await this.postRepo.save(newPost);
    return new PostView(post);
  }

  async getAll(
    search?: string,
    categoryId?: number,
    offset = 0,
    limit = 20,
  ): Promise<PaginationDto<PostView>> {
    let query = this.dataSource
      .getRepository(Post)
      .createQueryBuilder('posts')
      .innerJoinAndSelect('posts.category', 'category');
    if (search) {
      query.where('posts.title ILIKE :title', { title: `%${search}%` });
    }
    if (categoryId) {
      query.andWhere('posts.category.id = :categoryId', {
        categoryId: categoryId,
      });
    }
    query
      .andWhere('posts.status IS FALSE')
      .addOrderBy('posts.updated_at', 'DESC')
      .limit(limit)
      .offset(offset);

    const posts = await query.getMany();
    const totalCount = await this.postRepo.count();
    return this.mapView(posts, limit, offset, totalCount);
  }

  async getAllRelease(
    search?: string,
    categoryId?: number,
    offset = 0,
    limit = 20,
  ): Promise<PaginationDto<PostView>> {
    let query = this.dataSource
      .getRepository(Post)
      .createQueryBuilder('posts')
      .innerJoinAndSelect('posts.category', 'category');
    if (search) {
      query.where('posts.title ILIKE :title', { title: `%${search}%` });
    }
    if (categoryId) {
      query.andWhere('posts.category.id = :categoryId', {
        categoryId: categoryId,
      });
    }
    query
      .andWhere('posts.status IS TRUE')
      .addOrderBy('posts.updated_at', 'DESC')
      .limit(limit)
      .offset(offset);

    const posts = await query.getMany();
    const totalCount = await this.postRepo.count();
    return this.mapView(posts, limit, offset, totalCount);
  }

  async getPopular() {
    const posts = await this.postRepo.find({
      order: {
        view: 'DESC',
      },
      take: 5,
    });

    const totalCount = posts.length;
    return new PaginationDto(
      posts.map((item) => new PostView(item)),
      undefined,
      undefined,
      totalCount,
    );
  }

  async getTotalView() {
    const totalView = await this.dataSource.query(
      'SELECT COALESCE(SUM(posts.view), 0) as total FROM posts',
    );
    return {
      total: Number(totalView[0].total),
    };
  }

  async getOne(id: number): Promise<PostView> {
    const post = await this.postRepo.findOne({
      where: {
        id: id,
      },
      relations: {
        category: true,
      },
    });
    if (!post) {
      throw new NotFoundException(`Post ${id} not found`);
    }
    return new PostView(post);
  }

  async update(id: number, postUpdate: PostUpdate): Promise<PostView> {
    const postTobeUpdate = await this.postRepo.findOneBy({ id: id });
    const category = await this.categoryService.getOne(postUpdate.categoryId);
    if (!postTobeUpdate) {
      throw new NotFoundException(`Post ${id} not found`);
    }
    if (!category) {
      throw new NotFoundException(`Invalide cateogryId not found`);
    }

    if (postUpdate.title) {
      postTobeUpdate.title = postUpdate.title;
    }

    if (postUpdate.description) {
      postTobeUpdate.description = postUpdate.description;
    }

    if (postUpdate.categoryId) {
      postTobeUpdate.category = category;
    }

    if (postUpdate.authorName) {
      postTobeUpdate.authorName = postUpdate.authorName;
    }

    if (postUpdate.content) {
      postTobeUpdate.content = postUpdate.content;
    }

    if (postUpdate.thumbnail) {
      postTobeUpdate.thumbnail = postUpdate.thumbnail;
    }

    if (postUpdate.status) {
      postTobeUpdate.status = postUpdate.status;
    }
    postTobeUpdate.updatedAt = new Date();

    const post = await this.postRepo.save(postTobeUpdate);
    return new PostView(post);
  }

  async delete(id: number) {
    const post = await this.postRepo.findOneBy({ id: id });
    if (!post) {
      throw new NotFoundException(`Post ${id} not found`);
    }
    return this.postRepo.delete({ id: id });
  }

  async batchDelete(ids: number[]) {
    let query = this.dataSource
      .getRepository(Post)
      .createQueryBuilder('posts')
      .select('posts.id');

    for (const id of ids) {
      const post = await query.where('id = :id', { id: id }).getOne();
      if (!post) {
        throw new NotFoundException(`Post ${id} not found`);
      }
      return this.postRepo.delete({ id: post.id });
    }
  }

  private mapView(
    posts: Post[],
    limit: number,
    offset: number,
    totalCount: number,
  ) {
    const views = posts.map((item) => new PostView(item));
    const postLimit = Number(limit);
    const postOffset = offset === undefined ? 0 : Number(offset);

    return new PaginationDto(views, postLimit, postOffset, totalCount);
  }
}
