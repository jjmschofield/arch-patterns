import {getNextMessageExclusively, releaseLock} from "./get";
import {recordFailure} from "./fail";
import {destroy} from "./destroy";
import log from "../../../lib/logger";
import {Message, MessageRecord} from "./types";

type MessageTransport = (message: Message) => Promise<void>;

interface Config {
  pollIntervalMs: number,
  retryDelayMs: number,
  maxAttempts: number,
}

export const startSendingMessages = (transport: MessageTransport, config: Config) => {
  log.info('RELAY_QUEUE_POLL_START', 'starting to process backlog of messages');

  sendNextMessage(transport, config);
};

export const sendNextMessage = async (transport: MessageTransport, config: Config) => {
  const message = await getNextMessageExclusively(config.retryDelayMs);

  if (message) {
    log.info(
      'RELAY_QUEUE_FOUND_MESSAGE',
      'processing pending message',
      {id: message.id, correlation: message.correlation}
    );

    await trySendMessage(transport, message, config.maxAttempts);
  }

  setTimeout(() => sendNextMessage(transport, config), config.pollIntervalMs);
};

const trySendMessage = async (transport: MessageTransport, message: MessageRecord, maxAttempts: number) => {
  try {
    await transport(message);

    await destroy(message);

    log.info('MESSAGE_PROCESSED', 'message deleted from queue', {id: message.id, correlation: message.correlation});
  } catch (error) {
    log.info('MESSAGE_DELIVERY_FAILED', 'message could not be delivered', {id: message.id, correlation: message.correlation});

    if (message.attempts! + 1 >= maxAttempts) {
      await destroy(message);
      log.info('MESSAGE_EXCEEDED_DELIVERY_ATTEMPTS', 'message cannot be delivered and has been deleted from queue', {id: message.id, correlation: message.correlation});
    } else {
      log.info('MESSAGE_WILL_BE_RETRIED', 'message queued for retry', {id: message.id, correlation: message.correlation});
      await recordFailure(message);
      await releaseLock(message);
    }
  }
};
