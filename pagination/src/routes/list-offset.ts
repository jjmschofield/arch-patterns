import { Context } from 'koa';
import { listProductsOffset } from '../lib/product';
import { calcOffsetLinks, defaultOffsetParams, OffsetPaginationParams } from '../lib/pagination';
import { tryGetInteger } from '../lib/numbers';


export const offsetPaginationCtrl = async (ctx: Context) => {
  const pagination = getPaginationParams(ctx);

  const paginated = await listProductsOffset(pagination);

  ctx.status = 200;

  ctx.body = {
    data: {
      products: paginated.collection,
    },
    meta: {
      total: paginated.total,
    },
    links: calcOffsetLinks(paginated, `${ctx.protocol}://${ctx.host}${ctx.path}`),
  };
};

const getPaginationParams = (ctx: Context): OffsetPaginationParams => {
  const params = defaultOffsetParams();

  if (ctx.query.limit) {
    params.limit = tryGetInteger(ctx.query.limit);
  }

  if (ctx.query.offset) {
    params.offset = tryGetInteger(ctx.query.offset);
  }

  return params;
};
