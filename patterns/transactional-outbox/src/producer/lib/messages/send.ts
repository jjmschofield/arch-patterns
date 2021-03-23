import {getNextMessageExclusively, releaseLock} from "./get";
import {recordFailure} from "./fail";
import {destroy} from "./destroy";
import log from "../../../lib/logger";
import {Message, MessageRecord} from "./types";

type MessageTransport = (message: Message) => Promise<void>;

export const startSendingMessages = (transport: MessageTransport) => {
  log.info('RELAY_QUEUE_POLL_START', 'starting to process backlog of messages');

  const config = {
    delayMs: parseInt(process.env.BATCH_DELAY_MS || '10'),
    retryDelayMs: parseInt(process.env.BATCH_DELAY_MS || '30000'),
    maxAttempts: parseInt(process.env.BATCH_DELAY_MS || '3')
  }

  sendNextMessage(transport, config.delayMs, config.retryDelayMs, config.maxAttempts);
}

export const sendNextMessage = async (transport: MessageTransport, delayMs: number, retryDelayMs: number, maxAttempts: number) => {
  const message = await getNextMessageExclusively(retryDelayMs);

  if (message) {
    log.info(
      'RELAY_QUEUE_FOUND_MESSAGE',
      'processing pending message',
      {id: message.id, correlation: message.correlation}
    );

    await attemptToSendMessage(transport, message, maxAttempts);
  }

  setTimeout(() => sendNextMessage(transport, delayMs, retryDelayMs, maxAttempts), delayMs);
}

const attemptToSendMessage = async (transport: MessageTransport, message: MessageRecord, maxAttempts: number) => {
  try {
    await transport(message);

    await destroy(message);

    log.info('MESSAGE_PROCESSED', 'message deleted from queue', {id: message.id, correlation: message.correlation});
  } catch (error) {
    log.info('MESSAGE_DELIVERY_FAILED', 'message could not be delivered', {id: message.id, correlation: message.correlation});

    if (message.attempts! + 1 >= maxAttempts) {
      await destroy(message);
      log.info('MESSAGE_EXCEEDED_DELIVERY_ATTEMPTS', 'message cannot be delivered and has been deleted from queue');

    } else {
      log.info('MESSAGE_WILL_BE_RETRIED', 'message queued for retry');
      await recordFailure(message);
      await releaseLock(message);
    }
  }
}
