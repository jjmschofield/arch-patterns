import { CursorPaginationParams } from "./types";

export const defaultCursorParams = (): CursorPaginationParams => {
  return {
    cursor: null,
    limit: 10,
    field: 'cursor',
  };
};
