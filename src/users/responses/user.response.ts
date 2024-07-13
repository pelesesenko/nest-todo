import { Exclude } from 'class-transformer';
import { Board } from '../../boards/board.entity';
import { User, UserRoles } from '../user.entity';

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
