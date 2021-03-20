import {Context} from "koa";
import log from "../../lib/logger";
import correlator from "correlation-id";
import {sendMessage} from "../lib/clients/receiver";

export const sendSyncCtrl = async (ctx: Context, next: Function) => {
  const message = {
    id: ctx.request.body.id,
    msg: ctx.request.body.msg,
    correlation: correlator.getId() || 'NOT SET',
  }

  await sendMessage(message)

  ctx.status = 200;
  ctx.body = {id: message.id, msg: message.msg};
};
