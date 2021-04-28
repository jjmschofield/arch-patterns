import { Context } from 'koa';
import { listProducts } from '../lib/product';

export const noPaginationCtrl = async (ctx: Context) => {
  const products = await listProducts();
  ctx.status = 200;
  ctx.body = { data: { products } };
};
