import { UserMongoType } from '../../../db/mongoDb/schemes/user.schemes';
import { ProfileViewModel } from '../models/output/ProfileViewModel';

export const meUserMapper = (user: UserMongoType): ProfileViewModel => {
  return {
    lastName: user.lastName,
    firstName: user.firstName,
    email: user.email,
  };
};
