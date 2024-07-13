import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator';

export class TaskDto {
  @ApiProperty({ example: 'some title', description: 'Task title' })
  @IsString({ message: 'Must be string' })
  @Length(1, 100, { message: 'Must have length between 1 and 100' })
  title: string;

  @ApiProperty({
    example: 'some description',
    description: 'Task description',
  })
  @IsString({ message: 'Must be string' })
  @Length(0, 300, { message: 'Maximum length 300' })
  description: string;

  @ApiProperty({
    example: 15,
    description: 'List where task will be created',
  })
  @IsNumber()
  listId: number;
}
