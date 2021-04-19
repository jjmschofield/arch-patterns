export const encodeCursor = (field: string, value: string): string => {
  return Buffer.from(`${field}:${value}`).toString('base64');
};

export const decodeCursor = (cursor: string, field: string): string => {
  const decoded = Buffer.from(cursor, 'base64').toString('utf8');

  const regex = new RegExp(`^${field}:\\w+$`); // key:value

  if (!regex.test(decoded)) {
    throw new Error('invalid cursor');
  }

  return decoded.replace(`${field}:`, '');
};
