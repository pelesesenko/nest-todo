import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNumber,
  IsString,
  Length,
  Validate,
  ValidateIf,
} from 'class-validator';
import { FieldTypes } from '../field.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumberOrString } from '@common/constraints';

export class FieldDto {
  @ApiProperty({ example: 1, description: 'Board id' })
  @IsNumber()
  boardId: number;

  @ApiProperty({ example: 'SELECT', description: 'Field values type' })
  @IsIn(Object.values(FieldTypes))
  type: FieldTypes;

  @ApiProperty({
    example: ['first', 'second'],
    description: 'Options for fields with type SELECT',
  })
  @ValidateIf((dto) => dto.type === FieldTypes.select)
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(20)
  @Validate(IsNumberOrString, [20], { each: true })
  options?: (string | number)[];

  @ApiProperty({ example: 'Some field name', description: 'Field name' })
  @IsString({ message: 'Must be string' })
  @Length(1, 50, { message: 'Must have length between 1 and 50' })
  name: string;
}
