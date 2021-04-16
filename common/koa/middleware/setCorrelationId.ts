import { Context } from 'koa';
import correlator from 'correlation-id';

export const setCorrelationId = (ctx: Context, next: Function): Promise<void> =>
  new Promise((resolve, reject) => {
    const providedCorrelationId = getCorrelationIdFromHeader(ctx);

    if (providedCorrelationId) {
      correlator.withId(providedCorrelationId, async () => {
        await correlatedNext(ctx, next, resolve, reject);
      });
    } else {
      correlator.withId(async () => {
        await correlatedNext(ctx, next, resolve, reject);
      });
    }
  });


const correlatedNext = async (ctx: Context, next: Function, resolve: Function, reject: Function) => {
  try {
    ctx.set('x-correlation-id', correlator.getId() || 'NOT_SET');
    await next();
    resolve();
  }
  catch (error) {
    reject(error);
  }
};

const getCorrelationIdFromHeader = (ctx: Context): string | null => {
  if (typeof ctx.req.headers['x-correlation-id'] === 'string') {
    // @ts-ignore
    return ctx.req.headers['x-correlation-id'];
  }

  return null;
};
