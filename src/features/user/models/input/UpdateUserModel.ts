import { Length } from 'class-validator';

export class UpdateUserModel {
  @Length(2, 30)
  lastName: string;

  @Length(2, 30)
  firstName: string;
}
