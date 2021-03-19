import {Context} from "koa";
import {SendRequestBody} from "../../types";
import needle from "needle";
import log from "../../lib/logger";
import correlator from "correlation-id";

export const sendSyncCtrl = async (ctx: Context, next: Function) => {
  ctx.status = 200;

  const event: SendRequestBody = {
    id: ctx.request.body.id,
    msg: ctx.request.body.msg
  }

  try {
    log.info('EVENT_SEND_START', 'sending event', event);

    await needle('post', process.env.RECEIVER_ENDPOINT || 'not set', event, {
      headers: {"x-correlation-id": correlator.getId()},
      response_timeout: 5000, // 5 seconds
    });

    log.info('EVENT_SEND_SUCCESS', 'event was sent successfully', event);

    ctx.status = 200;
    ctx.body = event;
  } catch (error) {
    log.error('EVENT_SEND_FAIL', 'event was not sent', event);
    throw error;
  }
};
