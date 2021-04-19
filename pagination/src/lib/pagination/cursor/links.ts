import { CursorPaginatedCollection } from './types';
import { PaginationLinks } from '../types';

export const calcCursorLinks = (paginated: CursorPaginatedCollection<unknown>, url: string): PaginationLinks => {
  const { self, last, prev, next } = paginated.cursors;

  return {
    self: self ? `${url}?ordering=${paginated.params.field}&cursor=${paginated.cursors.self}&limit=${paginated.params.limit}` : null,
    first: `${url}?ordering=${paginated.params.field}&limit=${paginated.params.limit}`,
    last: last ? `${url}?ordering=${paginated.params.field}&cursor=${last}&limit=${paginated.params.limit}` : null,
    prev: prev ? `${url}?ordering=${paginated.params.field}&cursor=${prev}&limit=${paginated.params.limit}` : null,
    next: next ? `${url}?ordering=${paginated.params.field}&cursor=${next}&limit=${paginated.params.limit}` : null,
  };
};
