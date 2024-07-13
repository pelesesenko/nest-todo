import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { IsNumberOrString } from '@lib/constraints';

export class SetFieldValueDto {
  @ApiProperty({ example: 1, description: 'Field id' })
  @IsNumber()
  fieldId: number;

  @ApiProperty({
    example: 'Depends on field type',
    description: 'Value to set in field',
  })
  @Validate(IsNumberOrString)
  @IsNotEmpty()
  value: string | number;
}
