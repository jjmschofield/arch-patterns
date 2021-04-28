import { CursorPaginationParams, SORT_ORDERS } from "./types";

export const calcOrder = (pagination: CursorPaginationParams, reverse?: boolean): string[][] => {
  const order = reverse ? reverseOrder(pagination.order) : pagination.order;

  const optional = pagination.sort.optional.map(field => [field, order]);

  const stable = pagination.sort.stable.map(field => [field, order]);

  const result = [...optional, ...stable];

  return result;
};

export const reverseOrder = (order: SORT_ORDERS): SORT_ORDERS => {
  return order === SORT_ORDERS.ASC ? SORT_ORDERS.DESC : SORT_ORDERS.DESC;
};
