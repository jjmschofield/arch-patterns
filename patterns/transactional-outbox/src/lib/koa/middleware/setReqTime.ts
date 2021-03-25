import { Context } from 'koa';

export const setReqTime = async (ctx: Context, next: Function): Promise<void> => {
  const start = Date.now();
  try {
    await next();
  }
  catch (error) {
    throw error;
  }
  finally {
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
  }
};

