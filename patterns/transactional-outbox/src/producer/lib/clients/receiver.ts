import log from "../../../lib/logger";
import needle from "needle";

export const sendMessage = async (message: { id: string, msg: string, correlation: string }) => {
  try{
    log.info('MESSAGE_SEND_START', 'sending message', message);

    await needle('post', process.env.RECEIVER_ENDPOINT || 'not set', message, {
      headers: {"x-correlation-id": message.correlation},
      response_timeout: 5000, // 5 second timeout
    });

    log.info('MESSAGE_SEND_SUCCESS', 'wessage was sent successfully', message);
  }
  catch(error){
    log.error('MESSAGE_SEND_FAIL', 'message was not sent', message);
    throw error;
  }
};
