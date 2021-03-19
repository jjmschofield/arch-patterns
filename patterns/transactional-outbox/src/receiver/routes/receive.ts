import {Context} from "koa";
import {SendRequestBody} from "../../types";
import log from '../../lib/logger'

export const receiveCtrl = async (ctx: Context, next: Function) => {
  ctx.status = 200;

  const event : SendRequestBody = {
    id: ctx.request.body.id,
    msg: ctx.request.body.msg
  }

  log.info('EVENT_RECEIVED', 'event received thank you', event);

  ctx.status = 200;
  ctx.body = event;
};
