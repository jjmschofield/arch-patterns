import {PersonRecord} from './types';
import {PersonModel} from './model';

export const listPeople = async (): Promise<PersonRecord[]> => {
  const people = await PersonModel.findAll();
  return people.map(p => p.toPojo());
};

export interface PaginatedCollection<CollectionType, PointerType> {
  collection: CollectionType[];
  links: PaginationPointers<PointerType>;
  params: PaginationParams;
  count: number;
}

export interface PaginationPointers<T> {
  first: T | null;
  last: T | null;
  prev: T | null;
  next: T | null;
}

export interface PaginationParams {
  limit: number;
  offset: number;
}

export const listPeopleWithOffset = async (pagination: PaginationParams = {limit: 10, offset: 0}): Promise<PaginatedCollection<PersonRecord, number>> => {
  const max = await PersonModel.count();

  const people = await PersonModel.findAll({
    offset: pagination.offset,
    limit: pagination.limit,
  });

  const collection = people.map(p => p.toPojo());

  return {
    collection,
    links: {
      first: calcFirst(pagination, collection),
      last: calcLast(pagination, collection, max),
      prev: calcPrevOffset(pagination, collection),
      next: calcNextOffset(pagination, collection, max),
    },
    params: pagination,
    count: max,
  };
};

const calcFirst = (pagination: PaginationParams, collection: unknown[]): number | null => {
  if (collection.length < 1) return null;
  return 0;
};

const calcLast = (pagination: PaginationParams, collection: unknown[], max: number): number | null => {
  if (collection.length < 1) return null;

  const potential = max - pagination.limit;

  if (potential < 0) return 0;

  return potential;
};

const calcNextOffset = (pagination: PaginationParams, collection: unknown[], max: number): number | null => {
  if (collection.length < 1) return null;

  const potential = pagination.offset + pagination.limit;

  if (potential >= max) {
    return null;
  }

  return potential;
};

const calcPrevOffset = (pagination: PaginationParams, collection: unknown[]): number | null => {
  if (collection.length < 1) return null;

  const potential = pagination.offset - pagination.limit;
  if (potential <= 0) {
    return null;
  }

  return potential;
};
