import { Context } from 'koa';
import { listProductsCursor } from '../lib/product';
import { calcCursorLinks, CURSOR_TYPES, CursorPaginationParams, defaultCursorParams } from '../lib/pagination';
import { tryGetInteger } from '../lib/numbers';
import { badRequest, notImplemented } from '@hapi/boom';


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

  if (ctx.query.ordering) {
    if (typeof ctx.query.ordering !== 'string') {
      throw notImplemented('only single ordering keys are supported');
    }

    const allowedOrdering = ['cursor', 'createdAt', 'updatedAt'];

    if (!allowedOrdering.includes(ctx.query.ordering)) {
      throw badRequest(`ordering must be one of ${allowedOrdering.join(', ')}`);
    }

    params.field = ctx.query.ordering;

    if (params.field === 'createdAt' || params.field === 'updatedAt') {
      params.type = CURSOR_TYPES.DATE;
    }
  }

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
