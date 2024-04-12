import { IsEmail, Length, Matches } from 'class-validator';

export class CreateUserModel {
  @Length(3, 10)
  @Matches(`^[a-zA-Z0-9_-]*$`)
  login: string;

  @Length(2, 30)
  lastName: string;

  @Length(2, 30)
  firstName: string;

  @IsEmail()
  email: string;

  @Length(6, 20)
  password: string;
}
