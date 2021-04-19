import { CURSOR_TYPES, CursorPaginationParams } from './types';

export const defaultCursorParams = (): CursorPaginationParams => {
  return {
    cursor: null,
    limit: 10,
    field: 'cursor',
    type: CURSOR_TYPES.STRING,
  };
};
