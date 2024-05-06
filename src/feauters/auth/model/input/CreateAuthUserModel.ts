import { IsEmail, Length, Matches } from 'class-validator';
import { IsValidDate } from '../../../../utils/customDecorators/date.decorator';

export class CreateUserModel {
  @Length(2, 30)
  lastName: string;

  @Length(2, 30)
  firstName: string;

  @IsEmail()
  email: string;

  @IsValidDate()
  dateOfBirth: string;

  @Length(6, 20)
  password: string;
}
