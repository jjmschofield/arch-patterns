import { PersonRecord } from './types';
import { PersonModel } from './model';

export const listPeople = async (): Promise<PersonRecord[]> => {
  const people = await PersonModel.findAll();
  return people.map(p => p.toPojo());
};
