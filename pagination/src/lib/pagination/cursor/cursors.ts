import { CursorPaginationParams, Cursors } from './types';
import { encodeCursor } from './encoding';


export const calcCursors = (pagination: CursorPaginationParams, collection: object[], prevCollection: object[], total: number, lastCollection?: object[]): Cursors => {
  const self = calcSelf(pagination, collection, prevCollection, total);
  const last = lastCollection ? calcLast(pagination, collection, lastCollection, total) : null;
  const next = calcNext(pagination, collection, total);
  const prev = calcPrev(pagination, collection, prevCollection, total);

  return { self, last, next, prev };
};

const calcSelf = (pagination: CursorPaginationParams, collection: unknown[], prevCollection: unknown[], total: number): string | null => {
  if (!pagination.cursor) return null;
  if (prevCollection.length < 1) return null;
  if (total < collection.length) return null;

  const self = prevCollection[prevCollection.length - 1];

  if (!self) return null;

  return tryGetCursor(pagination, self);
};

const calcNext = (pagination: CursorPaginationParams, collection: unknown[], total: number): string | null => {
  if (total <= collection.length) return null;
  if (total < pagination.limit) return null;

  const next = collection[collection.length - 1];

  if (!next) return null;

  // TODO - handle on last, over fetch maybe?

  return tryGetCursor(pagination, next);
};

const calcPrev = (pagination: CursorPaginationParams, collection: unknown[], prevCollection: unknown[], total: number): string | null => {
  if (!pagination.cursor) return null;

  if (prevCollection.length < 1) return null;

  const prev = prevCollection[prevCollection.length - 1];

  if (!prev) return null;

  return tryGetCursor(pagination, prev);
};

// TODO - Currently expects last set in reverse order
const calcLast = (pagination: CursorPaginationParams, collection: unknown[], lastCollection: unknown[], total: number): string | null => {
  if (total <= collection.length) return null;

  const last = lastCollection[0];

  if (!last) return null;

  return tryGetCursor(pagination, last);
};

const tryGetCursor = (pagination: CursorPaginationParams, record: any): string => { // TODO - typing
  return encodeCursor(pagination, record);
};
