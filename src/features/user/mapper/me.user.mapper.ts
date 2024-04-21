export const meUserMapper = (user: any) => {
  return {
    lastName: user.lastName,
    firstName: user.firstName,
    email: user.email,
  };
};
