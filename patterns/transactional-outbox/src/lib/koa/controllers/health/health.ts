import { Context } from 'koa';
import { getHealth } from '../../../health';

// TODO - this should be secured
export const healthCtrl = async (ctx: Context, next: Function) => {
  const health = await getHealth();
  ctx.status = 200;
  ctx.body = health;
};
