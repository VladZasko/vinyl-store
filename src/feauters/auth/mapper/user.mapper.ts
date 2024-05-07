import { UserDBType } from '../../../db/schemes/user.schemes';
import { UserViewModel } from '../model/output/UserViewModel';
import moment from 'moment/moment';

export const userMapper = (user: UserDBType): UserViewModel => {
  return {
    id: user._id.toString(),
    lastName: user.accountData.lastName,
    firstName: user.accountData.firstName,
    dateOfBirth: moment(user.accountData.dateOfBirth).format('MM/DD/YYYY'),
    email: user.accountData.email,
    createdAt: user.accountData.createdAt,
    role: user.accountData.role,
  };
};
