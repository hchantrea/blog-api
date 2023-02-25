import { CategoryIdNameView } from './category-id-name.view';
import { Post } from '../entitys/post.entity';

export class PostView {
  id: string;
  title: string;
  description: string;
  category: CategoryIdNameView;
  authorName: string;
  content: string;
  thumbnail: string;
  view: number;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(post: Post) {
    this.id = post.id.toString();
    this.title = post.title;
    this.description = post.description;
    this.category = new CategoryIdNameView(post.category);
    this.authorName = post.authorName;
    this.content = post.content;
    this.thumbnail = post.thumbnail;
    this.view = post.view;
    this.status = post.status;
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
  }
}
