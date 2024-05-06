export type VinylsType = {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  createdAt: string;
};
export type VinylsViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: VinylsType[];
};
