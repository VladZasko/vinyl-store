export const mapper = (users: any) => {
  return {
    login: users.user_login,
    lastName: users.user_lastName,
    firstName: users.user_lastName,
    firstPost: {
      fullName: users.post_fullName,
      title: users.post_title,
      description: users.post_description,
      createdAt: users.createdAt,
      likesCount: users.like,
    },
  };
};
