import {Message} from "./types";
import {PendingMessageModel} from "./model";

export const createPendingMessage = async (message: Message): Promise<Message> => {
  const result = await PendingMessageModel.create({
    id: message.id,
    msg: message.msg,
    correlation: message.correlation,
  });

  return {
    id: result.id!,
    msg: result.msg!,
    correlation: result.correlation!,
  }
};
