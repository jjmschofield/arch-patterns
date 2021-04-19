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
  field: string;
  limit: number;
}

export enum CURSOR_TYPES {
  STRING = 'STRING',
  DATE ='DATE',
}