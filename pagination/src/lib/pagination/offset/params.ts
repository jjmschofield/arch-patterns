import { OffsetPaginationParams } from "./types";

export const defaultOffsetParams = (): OffsetPaginationParams => {
  return { limit: 10, offset: 0 };
};
