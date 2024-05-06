import { Length } from 'class-validator';
import { IsValidDate } from '../../../../utils/customDecorators/date.decorator';

export class UpdateUserModel {
  @Length(2, 30)
  lastName: string;

  @Length(2, 30)
  firstName: string;

  @IsValidDate()
  dateOfBirth: string;
}
