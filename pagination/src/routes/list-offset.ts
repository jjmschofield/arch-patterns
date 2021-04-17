import { Context } from 'koa';
import { badRequest } from '@hapi/boom';
import { listPeopleOffset } from '../lib/person';
import { calcOffsetLinks, defaultOffsetParams, OffsetPaginationParams } from '../lib/pagination';


export const offsetPaginationCtrl = async (ctx: Context) => {
  const pagination = getPaginationParams(ctx);

  const paginated = await listPeopleOffset(pagination);

  ctx.status = 200;

  ctx.body = {
    data: {
      people: paginated.collection,
    },
    meta: {
      total: paginated.total,
    },
    links: calcOffsetLinks(paginated, `${ctx.protocol}://${ctx.host}${ctx.path}`),
  };
};

const getPaginationParams = (ctx: Context) : OffsetPaginationParams => {
  const offsetParam = ctx.query.offset;
  const limitParam = ctx.query.limit;

  if (!offsetParam && !limitParam) {
    return defaultOffsetParams();
  }

  if (!(limitParam && offsetParam)) {
    throw badRequest('both limit and offset must be set');
  }

  return {
    offset: tryGetNumber(ctx.query.offset),
    limit: tryGetNumber(ctx.query.limit),
  };
};

const tryGetNumber = (maybeNumber: any): number => {
  const numberOrNaN = parseInt(maybeNumber, 10);

  if (isNaN(numberOrNaN)) {
    throw badRequest(`${maybeNumber} is not an integer`);
  }

  return numberOrNaN;
};
