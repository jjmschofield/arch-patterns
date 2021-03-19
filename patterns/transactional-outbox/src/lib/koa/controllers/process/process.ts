import { Context } from 'koa';
import { getProcess } from '../../../process';

// TODO - this should be secured
export const processCtrl = async (ctx: Context, next: Function) => {
  const process = await getProcess();
  ctx.status = 200;
  ctx.body = process;
};
