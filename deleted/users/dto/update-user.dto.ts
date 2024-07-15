import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Jho', description: 'user name' })
  @IsString({ message: 'Must be string' })
  @Length(2, 30, { message: 'Must have length between 2 and 30' })
  name: string;
}
