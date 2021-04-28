import { Op } from 'sequelize';
import { Cursor, CursorPaginationParams, SORT_ORDERS } from "./types";
import { decodeCursor } from "./encoding";
import { reverseOrder } from "./order";

export const calcWhere = (pagination: CursorPaginationParams, reverse?: boolean) => {
  if (!pagination.cursor) return null;

  const cursor = decodeCursor(pagination.cursor, pagination);

  const order = reverse ? reverseOrder(pagination.order) : pagination.order;

  const orderToken = order === SORT_ORDERS.ASC ? Op.gt : Op.lt;

  const fields = [
    ...pagination.sort.optional, // Optional fields must come first
    ...pagination.sort.stable.filter(f => !pagination.sort.optional.includes(f)), // Remove duplicates
  ];

  return recursivelyBuildWhereClause(fields, cursor, orderToken);
};

// TODO - battle test the resulting query a bit
export const recursivelyBuildWhereClause = (fields: string[], cursor: Cursor, orderToken: symbol): any => {
  if (fields.length < 1) return undefined;

  const field = fields[0];

  if (fields.length === 1) {
    return {
      [field]: { [orderToken]: cursor[field] },
    };
  }

  return {
    [Op.or]: [
      {
        [field]: { [orderToken]: cursor[field] },
      },
      {
        [field]: cursor[field],
        ...recursivelyBuildWhereClause(fields.slice(1), cursor, orderToken),
      },
    ],
  };
};
