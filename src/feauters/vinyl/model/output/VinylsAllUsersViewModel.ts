type FirstReviewType = {
  author: string;
  content: string;
};

export type VinylsAllUserType = {
  title: string;
  author: string;
  description: string;
  price: number;
  average: number;
  firstReview: FirstReviewType | 'None';
};
export type VinylsAllUsersViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: VinylsAllUserType[];
};
