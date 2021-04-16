import log from "@common/logger";
import needle from "needle";
import {Message} from "../messages/types";

export const sendMessage = async (message: Message) => {
  try {
    log.info('MESSAGE_SEND_START', 'sending message', {id: message.id, correlation: message.correlation});

    await needle('post', process.env.RECEIVER_ENDPOINT || 'not set', message, {
      headers: {"x-correlation-id": message.correlation},
      response_timeout: 5000, // 5 second timeout
    });

    log.info('MESSAGE_SEND_SUCCESS', 'message was sent successfully', {id: message.id, correlation: message.correlation});
  } catch (error) {
    log.error('MESSAGE_SEND_FAIL', 'message was not sent', {id: message.id, correlation: message.correlation});
    throw error;
  }
};
