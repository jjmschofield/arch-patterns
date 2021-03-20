import {getNextMessage} from "./get";
import {sendMessage} from "../../clients/receiver";
import {recordFailure} from "./fail";
import {destroy} from "./destroy";
import log from "../../../lib/logger";
import correlator from "correlation-id";
import {Message} from "./types";

export const startSendingMessages = () => {
  log.info('RELAY_QUEUE_POLL_START', 'starting to process backlog of messages');

  const config = {
    delayMs: parseInt(process.env.BATCH_DELAY_MS || '500'),
    retryDelayMs: parseInt(process.env.BATCH_DELAY_MS || '1000'),
    maxAttempts: parseInt(process.env.BATCH_DELAY_MS || '3')
  }

  sendNextMessage(config.delayMs, config.retryDelayMs, config.maxAttempts);
}

export const sendNextMessage = async (delayMs: number, retryDelayMs: number, maxAttempts: number) => {
  const message = await getNextMessage(); // TODO retryDelayMs

  if (message) {
    log.info('RELAY_QUEUE_MESSAGE_PROCESSING', 'processing pending message', message);

    await attemptToSendMessage(message, maxAttempts);

    log.info('RELAY_QUEUE_SLEEP', 'sleeping before sending next batch');
  }

  setTimeout(() => sendNextMessage(delayMs, retryDelayMs, maxAttempts), delayMs);
}

const attemptToSendMessage = async (message: Message, maxAttempts: number) => {
  try {
    await sendMessage({id: message.id, msg: message.id}, message.correlation);

    await destroy(message._id!);

    log.info('RELAY_QUEUE_MESSAGE_PROCESSED', 'message deleted from queue');
  } catch (error) {
    if (message.attempts! >= maxAttempts) {
      await destroy(message._id!);
      log.info('MESSAGE_EXCEEDED_DELIVERY_ATTEMPTS', 'message cannot be delivered and has been deleted from queue');
    }

    log.info('MESSAGE_DELIVERY_FAILED', 'message could not be delivered and will be retried');
    await recordFailure(message);
  }
}
