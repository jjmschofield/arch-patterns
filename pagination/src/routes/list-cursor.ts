import { Context } from 'koa';
import { listProductsCursor } from '../lib/product';
import { calcCursorLinks, CursorPaginationParams, defaultCursorParams } from '../lib/pagination';
import { tryGetInteger } from '../lib/numbers';
import { badRequest } from '@hapi/boom';


export const cursorPaginationCtrl = async (ctx: Context) => {
  const pagination = getPaginationParams(ctx);

  const paginated = await listProductsCursor(pagination);

  ctx.status = 200;

  ctx.body = {
    data: {
      products: paginated.collection,
    },
    meta: {
      total: paginated.total,
    },
    links: calcCursorLinks(paginated, `${ctx.protocol}://${ctx.host}${ctx.path}`),
  };
};

const getPaginationParams = (ctx: Context): CursorPaginationParams => {
  const params = defaultCursorParams();

  if (ctx.query.limit) {
    params.limit = tryGetInteger(ctx.query.limit);
  }

  if (ctx.query.cursor) {
    if (typeof ctx.query.cursor !== 'string') {
      throw badRequest('only one cursor param is allowed');
    }

    params.cursor = ctx.query.cursor;
  }

  return params;
};
