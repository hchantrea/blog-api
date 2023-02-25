import { IsArray } from 'class-validator';

export class PaginationDto<T> {
  @IsArray()
  readonly items: T[];

  readonly prevOffset: number;
  readonly nextOffset: number;
  readonly totalCount: number;

  constructor(items: T[], limit = 20, offset = 0, totalCount: number) {
    this.items = items;
    this.prevOffset = this.getPreviousOffset(limit, offset, totalCount);
    this.nextOffset = this.getNextOffset(limit, offset, totalCount);
    this.totalCount = totalCount;
  }

  getNextOffset(limit: number, offset: number, total: number) {
    if (limit * offset > total || limit >= total) {
      return null;
    }

    if (offset === 0) {
      return offset * limit + limit;
    } else {
      return offset * limit;
    }
  }

  getPreviousOffset(limit: number, offset: number, total: number) {
    if (offset === 0) {
      return null;
    }

    if (offset >= limit) {
      return offset - limit;
    } else {
      return limit - offset;
    }
  }
}
