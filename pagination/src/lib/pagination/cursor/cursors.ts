import { CursorPaginationParams, Cursors } from './types';
import { encodeCursor } from './encoding';


export const calcCursors = (pagination: CursorPaginationParams, collection: object[], prevCollection: object[], total: number, lastCollection?: object[]): Cursors => {
  const self = calcSelf(pagination, collection, prevCollection, pagination.field, total);
  const last = lastCollection ? calcLast(pagination, collection, lastCollection, pagination.field, total) : null;
  const next = calcNext(pagination, collection, pagination.field, total);
  const prev = calcPrev(pagination, collection, prevCollection, pagination.field, total);

  return { self, last, next, prev };
};

const calcSelf = (pagination: CursorPaginationParams, collection: unknown[], prevCollection: unknown[], field: string, total: number): string | null => {
  if (total < collection.length) return null;
  if (!pagination.cursor) return null;

  const self = prevCollection[prevCollection.length - 1];

  if (!self) return null;

  return tryGetCursor(self, field);
};

const calcNext = (pagination: CursorPaginationParams, collection: unknown[], field: string, total: number): string | null => {
  if (total < collection.length) return null;

  if (total < pagination.limit) return null;

  const next = collection[collection.length - 1];

  if (!next) return null;

  return tryGetCursor(next, field);
};

const calcPrev = (pagination: CursorPaginationParams, collection: unknown[], prevCollection: unknown[], field: string, total: number): string | null => {
  if (total <= collection.length) return null;
  if (prevCollection.length < pagination.limit) return null;

  const prev = prevCollection[prevCollection.length - 1];

  if (!prev) return null;

  return tryGetCursor(prev, field);
};

const calcLast = (pagination: CursorPaginationParams, collection: unknown[], lastCollection: unknown[], field: string, total: number): string | null => {
  if (total <= collection.length) return null;
  if (lastCollection.length < pagination.limit) return null;

  const last = lastCollection[lastCollection.length - 1];

  if (!last) return null;

  return tryGetCursor(last, field);
};

const tryGetCursor = (obj: any, field: string): string => {
  if (!obj[field]) {
    throw new Error('cursor field not set on collection item');
  }

  return encodeCursor(field, obj[field].toString());
};
