import {getNextMessageExclusively, releaseLock} from "./get";
import {sendMessage} from "../clients/receiver";
import {recordFailure} from "./fail";
import {destroy} from "./destroy";
import log from "../../../lib/logger";
import {Message} from "./types";

export const startSendingMessages = () => {
  log.info('RELAY_QUEUE_POLL_START', 'starting to process backlog of messages');

  const config = {
    delayMs: parseInt(process.env.BATCH_DELAY_MS || '10'),
    retryDelayMs: parseInt(process.env.BATCH_DELAY_MS || '30000'),
    maxAttempts: parseInt(process.env.BATCH_DELAY_MS || '3')
  }

  sendNextMessage(config.delayMs, config.retryDelayMs, config.maxAttempts);
}

export const sendNextMessage = async (delayMs: number, retryDelayMs: number, maxAttempts: number) => {
  const message = await getNextMessageExclusively(retryDelayMs);

  if (message) {
    log.info('RELAY_QUEUE_FOUND_MESSAGE', 'processing pending message', message);

    await attemptToSendMessage(message, maxAttempts);
  }

  setTimeout(() => sendNextMessage(delayMs, retryDelayMs, maxAttempts), delayMs);
}

const attemptToSendMessage = async (message: Message, maxAttempts: number) => {
  try {
    await sendMessage({id: message.id, msg: message.id, correlation: message.correlation});

    await destroy(message._id!);

    log.info('MESSAGE_PROCESSED', 'message deleted from queue');
  } catch (error) {
    log.info('MESSAGE_DELIVERY_FAILED', 'message could not be delivered');

    if (message.attempts! + 1 >= maxAttempts) {
      await destroy(message._id!);
      log.info('MESSAGE_EXCEEDED_DELIVERY_ATTEMPTS', 'message cannot be delivered and has been deleted from queue');

    } else{
      log.info('MESSAGE_WILL_BE_RETRIED', 'message queued for retry');
      await recordFailure(message);
      await releaseLock(message);
    }
  }
}
