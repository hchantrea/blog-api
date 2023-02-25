import { Category } from './../entitys/category.entity';

export class CategoryView {
  id: string;
  name: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(category: Category) {
    (this.id = category.id.toString()), (this.name = category.name);
    this.status = category.status;
    this.createdAt = category.createdAt;
    this.updatedAt = category.updatedAt;
  }
}
