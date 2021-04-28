import { CURSOR_TYPES, CursorPaginationParams, SORT_ORDERS } from './types';

export const defaultCursorParams = (): CursorPaginationParams => {
  return {
    cursor: null,
    limit: 10,
    sort: {
      stable: ['createdAt', 'id'],
      optional: [],
    },
    order: SORT_ORDERS.ASC,
    type: CURSOR_TYPES.STRING,
  };
};
