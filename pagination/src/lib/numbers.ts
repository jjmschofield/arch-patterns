import { badRequest } from '@hapi/boom';

export const tryGetInteger = (maybeNumber: any): number => {
  const numberOrNaN = parseInt(maybeNumber, 10);

  if (isNaN(numberOrNaN)) {
    throw badRequest(`${maybeNumber} is not an integer`);
  }

  return numberOrNaN;
};
