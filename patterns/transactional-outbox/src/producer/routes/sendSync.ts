import {Context} from "koa";
import log from "../../lib/logger";
import correlator from "correlation-id";
import {sendMessage} from "../clients/receiver";

export const sendSyncCtrl = async (ctx: Context, next: Function) => {
  const message = {
    id: ctx.request.body.id,
    msg: ctx.request.body.msg
  }

  await sendMessage( message, correlator.getId() || 'NOT SET')

  ctx.status = 200;
  ctx.body = message;
};
