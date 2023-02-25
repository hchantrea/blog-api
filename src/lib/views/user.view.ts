import { Role } from './../enum/role.enum';
import { User } from '../entitys/user.entity';

export class UserView {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
  profile: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    (this.id = user.id.toString()), (this.firstName = user.firstName);
    this.lastName = user.lastName;
    this.email = user.email;
    this.roles = user.roles;
    this.profile = user.profile;
    this.status = user.status;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
