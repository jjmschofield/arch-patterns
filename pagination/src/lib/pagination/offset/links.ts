import { OffsetPaginatedCollection, OffsetPaginationParams } from './types';
import { PaginationLinks } from '../types';

export const calcOffsetLinks = (paginated: OffsetPaginatedCollection<unknown>, url: string): PaginationLinks => {
  const first = calcFirst(paginated.params, paginated.collection);
  const last = calcLast(paginated.params, paginated.collection, paginated.total);
  const prev = calcPrevOffset(paginated.params, paginated.collection);
  const next = calcNextOffset(paginated.params, paginated.collection, paginated.total);

  return {
    self: `${url}?offset=${paginated.params.offset}&limit=${paginated.params.limit}`,
    first: first !== null ? `${url}?offset=${first}&limit=${paginated.params.limit}` : null,
    last: last !== null ? `${url}?offset=${last}&limit=${paginated.params.limit}` : null,
    prev: prev !== null ? `${url}?offset=${prev}&limit=${paginated.params.limit}` : null,
    next: next !== null ? `${url}?offset=${next}&limit=${paginated.params.limit}` : null,
  };
};

const calcFirst = (pagination: OffsetPaginationParams, collection: unknown[]): number | null => {
  if (collection.length < 1) return null;
  return 0;
};

const calcLast = (pagination: OffsetPaginationParams, collection: unknown[], total: number): number | null => {
  if (collection.length < 1) return null;

  const potential = total - pagination.limit;

  if (potential < 0) return 0;

  return potential;
};

const calcNextOffset = (pagination: OffsetPaginationParams, collection: unknown[], total: number): number | null => {
  if (collection.length < 1) return null;

  const potential = pagination.offset + pagination.limit;

  if (potential >= total) {
    return null;
  }

  return potential;
};

const calcPrevOffset = (pagination: OffsetPaginationParams, collection: unknown[]): number | null => {
  if (collection.length < 1) return null;

  const potential = pagination.offset - pagination.limit;

  if (potential <= 0) {
    return null;
  }

  return potential;
};
