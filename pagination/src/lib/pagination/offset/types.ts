export interface OffsetPaginatedCollection<CollectionType> {
  collection: CollectionType[];
  params: OffsetPaginationParams;
  total: number;
}

export interface OffsetPaginationParams {
  limit: number;
  offset: number;
}
