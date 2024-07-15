import { Exclude } from 'class-transformer';
import { Board } from '../../boards/board.entity';
import { User } from '../user.entity';
import { UserRoles } from '@common/decorators';

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

  boards: Board[];

  constructor(user: User | false) {
    if (user) Object.assign(this, user);
  }
}
