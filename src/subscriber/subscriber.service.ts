import { SubscriberView } from './../lib/views/subscriber.view';
import { SubscriberCreate } from './../lib/models/subcriber.create';
import { Subscriber } from './../lib/entitys/subscriber.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from './../lib/models/pagination-dto';

@Injectable()
export class SubscriberService {
  constructor(
    @InjectRepository(Subscriber)
    private subscriberRepo: Repository<Subscriber>,
    private dataSource: DataSource,
  ) {}

  async create(subscribeCrate: SubscriberCreate): Promise<Subscriber> {
    return await this.subscriberRepo.save(
      this.subscriberRepo.create(subscribeCrate),
    );
  }

  async getAll(
    email?: string,
    offset?: number,
    limit?: number
  ): Promise<PaginationDto<SubscriberView>> {
    let query = this.dataSource
      .getRepository(Subscriber)
      .createQueryBuilder('subscribers')
    if (email) {
      query.where('subscribers.email ILIKE :email', { email: `%${email}%` });
    }
    query
      .addOrderBy('subscribers.updated_at', 'DESC')
      .limit(limit)
      .offset(offset);

    const subscribers = await query.getMany();
    const totalCount = await this.subscriberRepo.count();
    const views = subscribers.map((item) => new SubscriberView(item));
    const subLimit = Number(limit);
    const subOffset = offset === undefined ? 0 : Number(offset);

    return new PaginationDto(views, subLimit, subOffset, totalCount);
  }

  async getOne(id: number): Promise<Subscriber> {
    const subscriber = await this.subscriberRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!subscriber) {
      throw new NotFoundException(`Subscriber ${id} not found`);
    }
    return subscriber;
  }

  async update(
    id: number,
    subscriberUpdate: SubscriberCreate,
  ): Promise<Subscriber> {
    const subscriber = await this.subscriberRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!subscriber) {
      throw new NotFoundException(`Subscriber ${id} not found`);
    }
    if (subscriberUpdate.email) {
      subscriber.email = subscriberUpdate.email;
    }
    return await this.subscriberRepo.save(subscriber);
  }

  async delete(id: number) {
    const subscriber = await this.subscriberRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!subscriber) {
      throw new NotFoundException(`Subscriber ${id} not found`);
    }
    return await this.subscriberRepo.delete({ id: id });
  }

  async count(): Promise<number> {
    return await this.subscriberRepo.count();
  }
}
