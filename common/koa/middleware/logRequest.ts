import { Context } from 'koa';
import log from '../../logger';

export const logRequest = async (ctx: Context, next: Function): Promise<void> => {
  try {
    // logStart(ctx);
    await next();
    // logEnd(ctx);
  }
  catch (error) {
    if(ctx.status >= 500) {
      logError(error, ctx);
    }
    else{
      logEnd(ctx);
    }
  }
};

const logStart = (ctx: Context): void => {
  const request = {
    method: ctx.method,
    url: ctx.url,
  };

  log.info('REQ_START', `${ctx.method} ${ctx.url}`, request);
};

const logEnd = (ctx: Context): void => {
  const result = {
    method: ctx.method,
    url: ctx.url,
    status: ctx.status,
    responseTime: ctx.response.get('X-Response-Time'),
  };

  log.info('REQ_END', `${ctx.method} ${ctx.url} ${ctx.status}`, result);
};

export const logError = (error: Error, ctx: Context): void => {
  const result = {
    method: ctx.method,
    url: ctx.url,
    status: ctx.status,
    responseTime: ctx.response.get('X-Response-Time'),
    error: error.toString(),
  };

  log.error('REQ_ERROR', `${ctx.method} ${ctx.url} ${ctx.status}`, result);
};
