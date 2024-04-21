export const mapper = (posts: any) => {
  return {
    id: posts.p_id,
    fullName: posts.p_fullName,
    title: posts.p_title,
    description: posts.p_description,
    createdAt: posts.p_createdAt,
    likesCount: posts.likesCount,
  };
};
