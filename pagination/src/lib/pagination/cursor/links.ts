import { CursorPaginatedCollection } from './types';
import { PaginationLinks } from '../types';

interface QueryParams {
  [key: string]: string | string[];
}

export const calcCursorLinks = (paginated: CursorPaginatedCollection<unknown>, url: string, params: QueryParams): PaginationLinks => {
  const { self, last, prev, next } = paginated.cursors;

  return {
    self: self ? constructQuery(url, params, self) : null,
    first: constructQuery(url, params),
    last: last ? constructQuery(url, params, last) : null,
    prev: prev ? constructQuery(url, params, prev) : null,
    next: next ? constructQuery(url, params, next) : null,
  };
};

// TODO - either escape this properly or find a lib to do it
const constructQuery = (url: string, params: QueryParams, cursor?: string): string => {
  const paramKeys = Object.keys(params).filter(k => k !== 'cursor');

  const paramStrings = paramKeys.map((key) => {
    const param = params[key];

    if (Array.isArray(param)) {
      return `${key}=${param.join(',')}`;
    }

    return `${key}=${param}`;
  });

  if (cursor) {
    paramStrings.push(`cursor=${cursor}`);
  }

  if(paramStrings.length < 1) return url;

  return `${url}?${paramStrings.join('&')}`;
};
