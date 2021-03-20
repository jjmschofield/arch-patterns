import {Op} from 'sequelize';
import {PendingMessageModel} from "./model";
import {Message} from "./types";
import {getDb} from "../db";

export const getNextMessageExclusively = async (retryDelayMs: number): Promise<Message | null> => {

  const t = await getDb().transaction();

  const message = await PendingMessageModel.findOne({
    where: {
      lastAttempt: {
        [Op.or]: {
          [Op.eq]: null,
          [Op.lt]: new Date(Date.now() - retryDelayMs)
        },
      },
      lockedAt: {
        [Op.or]: {
          [Op.eq]: null,
          [Op.lt]: new Date(Date.now() - retryDelayMs)
        },
      }
    },
    order: [['createdAt', 'ASC']],
    transaction: t,
    lock: true,
    skipLocked: true,
  });

  if (message) {
    await PendingMessageModel.update(
      {lockedAt: new Date()},
      {
        where: {
          _id: message!._id,
        },
        transaction: t,
      }
    );
  }

  await t.commit();

  if (!message) return null;

  return {
    _id: message._id!,
    id: message.id!,
    msg: message.msg!,
    correlation: message.correlation!,
    attempts: message.attempts!,
  };
};

export const releaseLock = async (message: Message) => {
  await PendingMessageModel.update(
    {lockedAt: null},
    {
      where: {
        _id: message!._id,
      }
    }
  );
}
