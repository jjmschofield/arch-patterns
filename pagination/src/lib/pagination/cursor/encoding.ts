import { CURSOR_TYPES } from "./types";

export const encodeCursor = (field: string, value: string | Date, type: CURSOR_TYPES): string => {
  let serialized: string;

  switch (type) {
    case CURSOR_TYPES.STRING:
      serialized = value as string;
      break;
    case CURSOR_TYPES.DATE:
      const date = value as Date;
      serialized = date.getTime().toString(); // TODO - watch for oddness in Date field in postgres
      break;
    default:
      serialized = value as string;
      break;
  }

  return Buffer.from(`${field}:${serialized}`).toString('base64');
};

export const decodeCursor = (cursor: string, field: string, type: CURSOR_TYPES): string | Date => {
  const decoded = Buffer.from(cursor, 'base64').toString('utf8');

  const [key, value] = decoded.split(':');

  if (key !== field) {
    throw new Error('invalid cursor');
  }

  switch (type) {
    case CURSOR_TYPES.STRING:
      return value;
    case CURSOR_TYPES.DATE:
      return new Date(parseInt(value, 10));
    default:
      return value;
  }
};
