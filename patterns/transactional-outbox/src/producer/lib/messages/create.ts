import {Message, MessageRecord} from "./types";
import {PendingMessageModel} from "./model";

export const createPendingMessage = async (message: Message): Promise<MessageRecord> => {
  const record = await PendingMessageModel.create({
    id: message.id,
    msg: message.msg,
    correlation: message.correlation,
  });

  return record.toPojo();
};
