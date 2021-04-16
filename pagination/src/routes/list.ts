import { Context } from 'koa';
import { listPeople } from '../lib/person';

export const listPeopleCtrl = async (ctx: Context) => {
  const people = await listPeople();
  ctx.status = 200;
  ctx.body = { data: { people } };
};
