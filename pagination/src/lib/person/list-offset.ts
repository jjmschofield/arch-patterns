import { OffsetPaginationParams, PaginatedCollection } from '../pagination';
import { PersonRecord } from './types';
import { PersonModel } from './model';

export const listPeopleOffset = async (pagination: OffsetPaginationParams): Promise<PaginatedCollection<PersonRecord, OffsetPaginationParams>> => {
  const total = await PersonModel.count();

  const people = await PersonModel.findAll({
    offset: pagination.offset,
    limit: pagination.limit,
  });

  const collection = people.map(p => p.toPojo());

  return {
    collection,
    params: pagination,
    total,
  };
};
