import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BadRequestException, Injectable } from '@nestjs/common';
import { subYears } from 'date-fns/subYears';
import { isWithinInterval } from 'date-fns/isWithinInterval';

@ValidatorConstraint({ name: 'IsValidDate', async: true })
@Injectable()
export class IsValidDateConstraint implements ValidatorConstraintInterface {
  constructor() {}
  async validate(dateOfBirth: string, args: ValidationArguments) {
    const dob = new Date(dateOfBirth);

    if (!dob) {
      throw new BadRequestException('Date incorrect');
    }

    const minDate = subYears(new Date(), 130);
    const maxDate = subYears(new Date(), 12);

    const validDate = isWithinInterval(dob, {
      start: minDate,
      end: maxDate,
    });

    if (!validDate) {
      throw new BadRequestException('Date incorrect');
    }

    return true;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Date incorrect';
  }
}

export function IsValidDate(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsValidDateConstraint,
    });
  };
}
