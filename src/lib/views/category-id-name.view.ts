import { Category } from './../entitys/category.entity';

export class CategoryIdNameView {
  id: string;
  name: string;

  constructor(category: Category) {
    this.id = category.id.toString();
    this.name = category.name;
  }
}
