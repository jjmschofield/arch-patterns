import { CursorPaginatedCollection } from './types';
import { PaginationLinks } from '../types';

export const calcCursorLinks = (paginated: CursorPaginatedCollection<unknown>, url: string): PaginationLinks => {
  const { self, last, prev, next } = paginated.cursors;

  return {
    self: self ? `${url}?cursor=${paginated.cursors.self}&limit=${paginated.params.limit}` : null,
    first: `${url}?limit=${paginated.params.limit}`,
    last: last ? `${url}?cursor=${last}&limit=${paginated.params.limit}` : null,
    prev: prev ? `${url}?cursor=${prev}&limit=${paginated.params.limit}` : null,
    next: next ? `${url}?cursor=${next}&limit=${paginated.params.limit}` : null,
  };
};
