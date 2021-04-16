import * as person from '../person';

export const syncDb = async () => {
  await person.sync();
};
