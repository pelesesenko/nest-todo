import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'string-or-number', async: false })
export class IsNumberOrString implements ValidatorConstraintInterface {
  validate(text: any, args: ValidationArguments) {
    const [maxLength] = args.constraints ?? [150];
    return (
      (typeof text === 'number' && text < Number.MAX_SAFE_INTEGER) ||
      (typeof text === 'string' && text.length <= maxLength)
    );
  }

  defaultMessage(args: ValidationArguments) {
    const [maxLength] = args.constraints ?? [150];
    return (
      'must be number less than 1e15 or string not longer than ' + maxLength
    );
  }
}
