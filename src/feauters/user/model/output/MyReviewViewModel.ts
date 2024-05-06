export type MyReviewType = {
  vinylTitle: string;
  content: string;
  createdAt: string;
  score: number;
};

export type MyReviewViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: MyReviewType[];
};
