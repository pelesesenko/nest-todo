import { SetMetadata } from '@nestjs/common';

export enum UserRoles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);
