import { User } from '../../users/user.entity';
import { Request } from 'express';

export interface ReqWithUser extends Request {
  user: User;
}
