import { Op } from 'sequelize';
import { CursorPaginationParams, PaginatedCollection } from '../pagination';
import { PersonRecord } from './types';
import { PersonModel } from './model';

export const listPeopleCursor = async (pagination: CursorPaginationParams<number>): Promise<PaginatedCollection<PersonRecord, CursorPaginationParams<number>>> => {
  const total = await PersonModel.count();

  const people = await PersonModel.findAll({
    where: {
      cursor: {
        [Op.gt]: pagination.cursor,
      },
    },
    order: [['cursor', 'ASC']],
    limit: pagination.limit,
  });

  const collection = people.map(p => p.toPojo());

  return {
    collection,
    params: pagination,
    total,
  };
};
