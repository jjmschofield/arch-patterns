export interface Cursor {
  [key: string]: string | Number | Date;
}

export interface CursorPaginatedCollection<CollectionType> {
  collection: CollectionType[];
  params: CursorPaginationParams;
  total: number;
  cursors: Cursors;
}

export interface Cursors {
  self: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface CursorPaginationParams {
  cursor: string | null;
  type: CURSOR_TYPES;
  sort: {
    stable: string[];
    optional: string[];
  };
  order: SORT_ORDERS;
  limit: number;
}

export enum CURSOR_TYPES {
  STRING = 'STRING',
  DATE = 'DATE',
}

export enum SORT_ORDERS {
  ASC = 'ASC',
  DESC = 'DESC',
}
