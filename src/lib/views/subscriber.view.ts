import { Subscriber } from './../entitys/subscriber.entity';
import { CategoryTag } from './../enum/category.enum';

export class SubscriberView {
  id: string;
  username: string;
  email: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(subscriber: Subscriber) {
    this.id = subscriber.id.toString();
    this.email = subscriber.email;
    this.status = subscriber.status;
    this.createdAt = subscriber.createdAt;
    this.updatedAt = subscriber.updatedAt;
  }
}
