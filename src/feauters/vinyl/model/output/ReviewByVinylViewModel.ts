export type ReviewsType = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  score: number;
};
export type ReviewsViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: ReviewsType[];
};
