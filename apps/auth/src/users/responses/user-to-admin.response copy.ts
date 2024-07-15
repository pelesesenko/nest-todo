import { Exclude } from 'class-transformer';
import { User } from '../user.entity';
import { UserRoles } from '@common/decorators';

export class UserToAdminResponse implements User {
  id: number;

  name: string;

  email: string;

  @Exclude()
  password: string;

  roles: UserRoles[];

  registered_at: Date;

  updated: Date;

  constructor(user: User | false) {
    if (user) Object.assign(this, user);
  }
}
