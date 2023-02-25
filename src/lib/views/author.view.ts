import { User } from '../entitys/user.entity';

export class AuthorView {
  id: string;
  firstName: string;
  lastName: string;

  constructor(author: User) {
    (this.id = author.id.toString()), (this.firstName = author.firstName);
    this.lastName = author.lastName;
  }
}
