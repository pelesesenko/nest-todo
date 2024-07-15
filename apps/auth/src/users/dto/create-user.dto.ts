import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'Email' })
  @IsString({ message: 'Must be string' })
  @IsEmail({}, { message: 'Incorrect email' })
  email: string;

  @ApiProperty({ example: '12345', description: 'password' })
  @IsString({ message: 'Must be string' })
  @Length(4, 16, { message: 'Must have length between 4 and 16' })
  password: string;
}
