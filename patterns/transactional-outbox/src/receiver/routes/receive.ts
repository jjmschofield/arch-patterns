import {Context} from "koa";
import log from '../../lib/logger'
import {saveMessage} from "../messages";

export const receiveCtrl = async (ctx: Context, next: Function) => {
  const message = {
    id: ctx.request.body.id,
    msg: ctx.request.body.msg,
    payload: ctx.request.body.payload,
    correlation: ctx.request.body.correlation,
  }

  saveMessage(message);

  log.info('MESSAGE_RECEIVED', 'message received thank you', {id: message.id, correlation: message.correlation});

  ctx.status = 200;
  ctx.body = message;
};
