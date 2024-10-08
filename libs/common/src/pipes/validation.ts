import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {
    const obj = plainToInstance(metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      const messages = errors.map((err) => {
        return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
      });
      throw new BadRequestException(messages);
    }
    return value;
  }
}

export const exceptionFactory = (errors: ValidationError[]) => {
  if (errors.length) {
    const messages = errors.map((err) => {
      return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
    });
    return new BadRequestException(messages);
  }
};
