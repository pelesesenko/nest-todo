import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ListDto {
  @ApiProperty({ example: 'some title', description: 'List title' })
  @IsString({ message: 'Must be string' })
  @Length(1, 50, { message: 'Must have length between 1 and 50' })
  title: string;

  // @IsNumber()
  // boardId: number;
}
