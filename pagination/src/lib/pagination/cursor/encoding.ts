import { Cursor, CursorPaginationParams } from "./types";

interface Record {
  [key: string]: string | Number | Date;
}

// TODO - resulting cursors are a bit bigger then they need to be
export const encodeCursor = (pagination: CursorPaginationParams, record: Record): string => { // TODO - coupling database column names to cursor values?
  const cursor: Cursor = {};

  pagination.sort.stable.forEach(field => cursor[field] = tryGetValueForField(field, record));

  pagination.sort.optional.forEach(field => cursor[field] = tryGetValueForField(field, record));

  const json = JSON.stringify(cursor);

  return Buffer.from(json).toString('base64');
};

export const decodeCursor = (cursor: string, pagination: CursorPaginationParams): Cursor => {
  const json = Buffer.from(cursor, 'base64').toString('utf8');

  const parsed = JSON.parse(json);

  const decoded : Cursor = {};

  pagination.sort.stable.forEach(field => decoded[field] = tryGetValueForField(field, parsed)); // TODO - validation?

  pagination.sort.optional.forEach(field => decoded[field] = tryGetValueForField(field, parsed)); // TODO - validation?

  return decoded;
};

const tryGetValueForField = (field: string, record: Record): string | Number | Date => {
  if (typeof record[field] === 'undefined') {
    throw new Error(`record does not have required field ${field}`);
  }

  return record[field];
};
