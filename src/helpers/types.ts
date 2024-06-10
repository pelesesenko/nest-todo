import { User } from '../users/user.entity';
import { Request } from 'express';

export type ReqWithUser = Request & { user: User };
