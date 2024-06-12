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
    // without this pipe throws when trying validate query params
    // if (!metatype || !this.toValidate(metatype)) {
    //   return value;
    // }
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
  // private toValidate(metatype: Function): boolean {
  //   const types: Function[] = [String, Boolean, Number, Array, Object];
  //   return !types.includes(metatype);
  // }
}

export const exceptionFactory = (errors: ValidationError[]) => {
  if (errors.length) {
    const messages = errors.map((err) => {
      return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
    });
    return new BadRequestException(messages);
  }
};
