import { UserViewModel } from '../model/output/UserViewModel';
import { UserDBType } from '../../../db/schemes/user.schemes';

export const userMapper = (userDb: UserDBType): UserViewModel => {
  return {
    id: userDb._id.toString(),
    login: userDb.accountData.login,
    lastName: userDb.accountData.lastName,
    firstName: userDb.accountData.firstName,
    dateOfBirth: userDb.accountData.dateOfBirth,
    email: userDb.accountData.email,
    createdAt: userDb.accountData.createdAt,
  };
};
