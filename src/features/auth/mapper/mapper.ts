import { UserViewModel } from '../../user/models/output/UserViewModel';
import { User } from '../../../db/sql/entity/user.entity';

export const userAuthMapper = (userDb: User): UserViewModel => {
  return {
    id: userDb.id,
    login: userDb.login,
    email: userDb.email,
    firstName: userDb.firstName,
    lastName: userDb.lastName,
    createdAt: userDb.createdAt,
  };
};
