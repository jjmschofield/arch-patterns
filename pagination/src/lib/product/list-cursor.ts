import { CursorPaginationParams, CursorPaginatedCollection, calcCursors, calcWhere, calcOrder } from '../pagination';
import { ProductRecord } from './types';
import { ProductModel } from './model';

export const listProductsCursor = async (pagination: CursorPaginationParams): Promise<CursorPaginatedCollection<ProductRecord>> => {
  const [total, products, prev, last] = await Promise.all<number, ProductModel[], any, any>([ // TODO - 4 db queries for one response :(
    getTotalProducts(),
    getCollection(pagination),
    getPreviousCollection(pagination),
    getLastCollection(pagination),
  ]);

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
  return ProductModel.findAll({
    where: calcWhere(pagination),
    order: calcOrder(pagination) as any, // TODO - fix typing
    limit: pagination.limit,
  });
};

// TODO - there is a bug here, on the second collection of a set we get empty
const getPreviousCollection = async (pagination: CursorPaginationParams) => {
  if(!pagination.cursor) return [];

  const results = await ProductModel.findAll({
    attributes: [...pagination.sort.stable, ...pagination.sort.optional],
    where: calcWhere(pagination, true),
    order: calcOrder(pagination, true) as any, // TODO - fix typing
    limit: pagination.limit,
  });
  return results;
};

export const getLastCollection = async (pagination: CursorPaginationParams) => {
  // @ts-ignore
  return ProductModel.findAll({
    attributes: [...pagination.sort.stable, ...pagination.sort.optional],
    order: calcOrder(pagination, true) as any,
    limit: pagination.limit + 1,
  });
};
