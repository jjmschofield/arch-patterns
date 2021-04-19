import { ProductRecord } from './types';
import { ProductModel } from './model';

export const listProducts = async (): Promise<ProductRecord[]> => {
  const products = await ProductModel.findAll();
  return products.map(p => p.toPojo());
};
