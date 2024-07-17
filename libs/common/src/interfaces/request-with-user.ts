import { Request } from 'express';
import { UserRoles } from './user-roles';

export interface ReqWithUser extends Request {
  user: {
    id: number;

    email: string;

    roles: UserRoles[];
  };
}
