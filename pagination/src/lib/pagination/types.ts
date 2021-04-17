export interface PaginatedCollection<CollectionType, PaginationParamType> {
  collection: CollectionType[];
  params: PaginationParamType;
  total: number;
}

export interface PaginationLinks {
  self: string | null;
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface OffsetPaginationParams {
  limit: number;
  offset: number;
}

export interface CursorPaginationParams<T> {
  cursor: T;
  limit: number;
}
