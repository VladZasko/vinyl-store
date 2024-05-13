export enum RoleForUser {
  Costumer = 'costumer',
  NotConfirmUser = 'notConfirmUser',
  Admin = 'admin',
}

export type CreateUserDto = {
  accountData: {
    lastName: string;
    firstName: string;
    dateOfBirth: string;
    email: string;
    createdAt: string;
    avatar: string;
    role: RoleForUser;
    passwordHash?: string;
    passwordSalt?: string;
  };
  emailConfirmation?: {
    confirmationCode: string;
    expirationDate: string;
    isConfirmed: boolean;
  };
};
