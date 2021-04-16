import * as person from '../person';

export const syncDb = async () => {
  await person.sync();
  await person.seed(20000);
};
