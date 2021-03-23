import {Op, Transaction} from 'sequelize';
import {MessageModel} from "./model";
import {MessageRecord} from "./types";
import {getDb} from "../db";
import log from "../../../lib/logger";

export const getNextMessageExclusively = async (retryDelayMs: number): Promise<MessageRecord | null> => {
  const transaction = await getDb().transaction();

  try {
    const message = await getNextMessage(retryDelayMs, transaction);

    if (message) {
      await lock(message.toPojo(), transaction);
    }

    await transaction.commit();

    if (!message) return null;

    return message.toPojo();
  } catch (error) {
    await transaction.rollback();
    log.error('GET_NEXT_MESSAGE_EXCLUSIVELY_ERROR', 'failed to get and lock next message');
    throw error;
  }
};

const getNextMessage = async (retryDelayMs: number, transaction: Transaction): Promise<MessageModel | null> => {
  return MessageModel.findOne({
    where: {
      lastAttemptAt: {
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
    transaction,
    lock: true,
    skipLocked: true,
  });
};

const lock = async (message: MessageRecord, transaction: Transaction): Promise<void> => {
  await MessageModel.update(
    {lockedAt: new Date()},
    {
      where: {
        id: message!.id,
      },
      transaction: transaction,
    }
  );
};

export const releaseLock = async (message: MessageRecord): Promise<void> => {
  await MessageModel.update(
    {lockedAt: null},
    {
      where: {
        id: message!.id,
      }
    }
  );
};
