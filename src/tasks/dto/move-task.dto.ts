import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class MoveTaskDto {
  @ApiProperty({ example: 1, description: 'rank move to' })
  @IsInt()
  @Min(1)
  rank: number;

  @ApiProperty({ example: 1, description: 'board move to' })
  @IsInt()
  @Min(1)
  listId: number;
}
