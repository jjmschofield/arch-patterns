import { OffsetPaginationParams, OffsetPaginatedCollection } from '../pagination';
import { ProductRecord } from './types';
import { ProductModel } from './model';

export const listProductsOffset = async (pagination: OffsetPaginationParams): Promise<OffsetPaginatedCollection<ProductRecord>> => {
  const total = await ProductModel.count();

  const products = await ProductModel.findAll({
    offset: pagination.offset,
    limit: pagination.limit,
  });

  const collection = products.map(p => p.toPojo());

  return {
    collection,
    params: pagination,
    total,
  };
};
