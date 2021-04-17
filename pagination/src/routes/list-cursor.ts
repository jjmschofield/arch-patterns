import { Context } from 'koa';
import { listPeopleCursor } from '../lib/person';
import { calcOffsetLinks, CursorPaginationParams, defaultCursorNumberParams, defaultOffsetParams, OffsetPaginationParams } from '../lib/pagination';
import { tryGetInteger } from '../lib/numbers';


export const cursorPaginationCtrl = async (ctx: Context) => {
  const pagination = getPaginationParams(ctx);

  const paginated = await listPeopleCursor(pagination);

  ctx.status = 200;

  ctx.body = {
    data: {
      people: paginated.collection,
    },
    meta: {
      total: paginated.total,
    },
    // links: calcOffsetLinks(paginated, `${ctx.protocol}://${ctx.host}${ctx.path}`), // TODO - links
  };
};

const getPaginationParams = (ctx: Context): CursorPaginationParams<number> => {
  const params = defaultCursorNumberParams();

  if (ctx.query.limit) {
    params.limit = tryGetInteger(ctx.query.limit);
  }

  if (ctx.query.cursor) {
    params.cursor = tryGetInteger(ctx.query.cursor);
  }

  return params;
};
