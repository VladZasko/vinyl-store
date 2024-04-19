import { Matches } from 'class-validator';

export class LoginAuthUserModel {
  @Matches(`^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$`)
  email: string;

  password: string;
}
