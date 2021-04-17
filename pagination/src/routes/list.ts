import {Context} from 'koa';
import {listPeople, listPeopleWithOffset} from '../lib/person';
import {PaginationParams, PaginationPointers} from "../lib/person/list";

export const noPaginationCtrl = async (ctx: Context) => {
  const people = await listPeople();
  ctx.status = 200;
  ctx.body = {data: {people}};
};

export const offsetPaginationCtrl = async (ctx: Context) => {
  const pagination = tryGetPaginationParams(ctx);

  const result = await listPeopleWithOffset(pagination);

  ctx.status = 200;

  ctx.body = {
    data: {
      people: result.collection,
    },
    meta: {
      count: result.count,
    },
    links: createLinkUrls(ctx, result.params, result.links),
  };
};

const tryGetPaginationParams = (ctx: Context) => {
  const offsetParam = ctx.query.offset;
  const limitParam = ctx.query.limit;

  if (!offsetParam && !limitParam) return;

  if (!(limitParam && offsetParam)) {
    throw new Error('both limit and offset must be set');
  }

  return {
    offset: tryGetNumber(ctx.query.offset),
    limit: tryGetNumber(ctx.query.limit),
  };
};

const tryGetNumber = (maybeNumber: any): number => {
  const numberOrNaN = Number(maybeNumber);

  // if (!Number.isInteger(maybeNumber)) {
  //   throw new Error(`${maybeNumber} is not an integer`);
  // }

  return numberOrNaN;
};

const createLinkUrls = (ctx: Context, params: PaginationParams, links: PaginationPointers<number>) => {
  const baseUrl = `${ctx.protocol}://${ctx.host}${ctx.path}`;

  return {
    self: `${baseUrl}?offset=${params.offset}&limit=${params.limit}`,
    first: links.first !== null ? `${baseUrl}?offset=0&limit=${params.limit}` : null,
    last: links.last !== null ? `${baseUrl}?offset=${links.last}&limit=${params.limit}` : null,
    prev: links.prev !== null ? `${baseUrl}?offset=${links.prev}&limit=${params.limit}` : null,
    next: links.next !== null ? `${baseUrl}?offset=${links.next}&limit=${params.limit}` : null,
  };

};
