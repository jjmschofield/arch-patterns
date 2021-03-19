import { Context } from 'koa';
import { STATUS_CODES } from '..';
import Boom from '@hapi/boom';

export const errorHandler = async (ctx: Context, next: Function) => {
  try {
    await next();

    if (ctx.status === 404) {
      const boom = new Boom(`Could not find ${ctx.req.url}`, { statusCode: ctx.status });
      ctx.status = 404; // We have to set the status again as the body= accessor will set the response to 200
      ctx.body = boom.output.payload;
    }
  }
  catch (error) {
    if (error.isBoom) {
      ctx.status = error.output.statusCode;
      ctx.body = error.output.payload;
    } else {
      ctx.status = error.status || STATUS_CODES.INTERNAL_SERVER_ERROR;
      const boom = new Boom(error.message, { statusCode: ctx.status });
      ctx.body = boom.output.payload;
    }

    ctx.app.emit('error', error, ctx);
    throw error;
  }
};
