import {Context} from "koa";
import {SendRequestBody} from "../../types";
import needle from "needle";
import log from "../../lib/logger";
import {createPendingMessage} from "../models/pending-message";
import correlator from "correlation-id";

export const sendCtrl = async (ctx: Context, next: Function) => {
  const message: SendRequestBody = {
    id: ctx.request.body.id,
    msg: ctx.request.body.msg
  }

  try {
    await createPendingMessage({ ...message, correlation: correlator.getId()!});

    log.info('STORE_IN_OUTBOX_SUCCESS', 'storing a message in outbox to be sent by worker', message);

    ctx.status = 201;
  } catch (error) {
    log.error('STORE_IN_OUTBOX_FAIL', 'failed to store message in outbox', message);
    throw error;
  }
};
