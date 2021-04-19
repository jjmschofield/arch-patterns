import { Op } from 'sequelize';
import { CursorPaginationParams, CursorPaginatedCollection, calcCursors, decodeCursor } from '../pagination';
import { ProductRecord } from './types';
import { ProductModel } from './model';

export const listProductsCursor = async (pagination: CursorPaginationParams): Promise<CursorPaginatedCollection<ProductRecord>> => {
  const [total, products, prev, last] = await Promise.all<number, ProductModel[], any, any>([
    getTotalProducts(),
    getCollection(pagination),
    getPreviousCollection(pagination),
    getLastCollection(pagination),
  ]);

  // TODO - talk about trade offs when generating links
  const collection = products.map(p => p.toPojo());

  return {
    collection,
    params: pagination,
    cursors: calcCursors(pagination, products, prev, total, last),
    total,
  };
};

const getTotalProducts = async (): Promise<number> => {
  return ProductModel.count();
};

const getCollection = async (pagination: CursorPaginationParams): Promise<ProductModel[]> => {

  // console.log('cursor', decodeCursor(pagination.cursor!, pagination.field, pagination.type));

  return ProductModel.findAll({
    where: {
      [pagination.field]: {
        [Op.gt]: pagination.cursor ? decodeCursor(pagination.cursor, pagination.field, pagination.type) : '0',
      },
    },
    order: [[pagination.field, 'ASC']],
    limit: pagination.limit,
  });
};

const getPreviousCollection = async (pagination: CursorPaginationParams) => {
  return ProductModel.findAll({
    attributes: [pagination.field],
    where: {
      [pagination.field]: {
        [Op.lte]: pagination.cursor ? decodeCursor(pagination.cursor, pagination.field, pagination.type) : '0',
      },
    },
    order: [[pagination.field, 'DESC']],
    limit: pagination.limit,
  });
};

export const getLastCollection = async (pagination: CursorPaginationParams) => {
  // @ts-ignore
  return ProductModel.findAll({
    attributes: [pagination.field],
    order: [[pagination.field, 'DESC']],
    limit: pagination.limit + 1,
  });
};
