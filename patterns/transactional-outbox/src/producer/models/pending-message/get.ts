import {PendingMessageModel} from "./model";
import {Message} from "./types";

export const getNextMessage = async () : Promise<Message | null> => {
  const message = await PendingMessageModel.findOne({
    order: [['lastAttempt', 'ASC']],
  });

  if(!message) return null;

  return {
    _id: message._id!,
    id: message.id!,
    msg: message.msg!,
    correlation: message.correlation!,
    attempts: message.attempts!,
  };
};
