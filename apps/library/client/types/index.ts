export type Book = {
  id: string;
  bookNumber: string;
  title: string;
  author: string | null;
  category: string | null;
  totalCopies?: number;
  jillNumber: string | null;
  kitaabNumber: string | null;
  muarafName: string | null;
  naashirName: string | null;
  language: string | null;
  shelfNumber: string | null;
  keefiyat: string | null;
  milkiyat: string | null;
  createdAt?: string;
};

export type BookListItem = Pick<Book, 'id' | 'title'>;

export type BookIssue = {
  id: string;
  bookId: string;
  book?: BookListItem;
  issuedTo: string;
  issuedAt: string;
  dueAt: string;
  returnedAt: string | null;
  status: string;
};

export type Author = { id: string; name: string };
export type Category = { id: string; name: string };
export type Nashir = { id: string; name: string };

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
