import { Exclude } from 'class-transformer';
import { User } from '../user.entity';
import { UserRoles } from '@common/interfaces';

export class UserResponse implements User {
  id: number;

  name: string;

  email: string;

  @Exclude()
  password: string;

  @Exclude()
  roles: UserRoles[];

  registered_at: Date;

  updated: Date;

  constructor(user: User | false) {
    if (user) Object.assign(this, user);
  }
}
