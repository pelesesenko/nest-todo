import { IsString, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateFieldDto {
  @ApiProperty({ example: 'Some field name', description: 'Field name' })
  @IsString({ message: 'Must be string' })
  @Length(1, 50, { message: 'Must have length between 1 and 50' })
  name: string;
}
