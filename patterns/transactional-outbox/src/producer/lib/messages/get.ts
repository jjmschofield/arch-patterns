import {Op} from 'sequelize';
import {PendingMessageModel} from "./model";
import {MessageRecord} from "./types";
import {getDb} from "../db";

export const getNextMessageExclusively = async (retryDelayMs: number): Promise<MessageRecord | null> => {
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

  return message.toPojo();
};

export const releaseLock = async (message: MessageRecord) => {
  await PendingMessageModel.update(
    {lockedAt: null},
    {
      where: {
        _id: message!._id,
      }
    }
  );
}
