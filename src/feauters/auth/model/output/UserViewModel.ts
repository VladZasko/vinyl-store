import { RoleForUser } from '../dto/CreateUserDto';

export type UserViewModel = {
  id: string;
  lastName: string;
  firstName: string;
  dateOfBirth: string;
  email: string;
  createdAt: string;
  role: RoleForUser;
};
