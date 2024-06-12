import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class BoardDto {
  @ApiProperty({ example: 'some title', description: 'Board title' })
  @IsString({ message: 'Must be string' })
  @Length(1, 50, { message: 'Must have length between 1 and 50' })
  title: string;

  @ApiProperty({
    example: 'some description',
    description: 'Board description',
  })
  @IsString({ message: 'Must be string' })
  @Length(0, 150, { message: 'Maximum length 150' })
  description: string;
}
