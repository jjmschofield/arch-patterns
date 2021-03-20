import {Op} from 'sequelize';
import {PendingMessageModel} from "./model";
import {Message} from "./types";

export const getNextMessage = async (retryDelayMs: number): Promise<Message | null> => {
  const message = await PendingMessageModel.findOne({
    where: {
      lastAttempt:{
        [Op.or]: {
          [Op.eq]: null,
          [Op.lt]: new Date(Date.now() - retryDelayMs)
        },
      },
    },
    order: [['createdAt', 'ASC']],
  });

  if (!message) return null;

  return {
    _id: message._id!,
    id: message.id!,
    msg: message.msg!,
    correlation: message.correlation!,
    attempts: message.attempts!,
  };
};
