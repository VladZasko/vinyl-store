import { UserDBType } from '../../../db/schemes/user.schemes';
import { UserProfileViewModel } from '../model/output/UserProfileViewModel';
import moment from 'moment';
export const userProfileMapper = (userDb: UserDBType): UserProfileViewModel => {
  return {
    avatar: userDb.accountData.avatar,
    lastName: userDb.accountData.lastName,
    firstName: userDb.accountData.firstName,
    dateOfBirth: moment(userDb.accountData.dateOfBirth).format('MM/DD/YYYY'),
  };
};
