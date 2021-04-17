import { CursorPaginationParams } from './types';

export const defaultCursorStringParams = (): CursorPaginationParams<string> => {
  return {
    cursor: '',
    limit: 10,
  };
};

export const defaultCursorNumberParams = (): CursorPaginationParams<number> => {
  return {
    cursor: 0,
    limit: 10,
  };
};
