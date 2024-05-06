export type MyVinylType = {
  title: string;
  author: string;
  description: string;
  purchasedDate: string;
};

export type MyVinylViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: MyVinylType[];
};
