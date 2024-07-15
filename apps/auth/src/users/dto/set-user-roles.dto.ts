import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsIn,
  IsInt,
} from 'class-validator';
import { UserRoles } from '@common/interfaces';

export class SetUserRolesDto {
  @ApiProperty({
    example: 1,
    description: 'user id',
  })
  @IsInt()
  id: number;

  @ApiProperty({
    example: ['USER', 'ADMIN'],
    description: 'Array of user roles',
  })
  @IsArray({ message: 'Must be array' })
  @ArrayMaxSize(Object.keys(UserRoles).length)
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsIn(Object.values(UserRoles), { each: true })
  roles: UserRoles[];
}
