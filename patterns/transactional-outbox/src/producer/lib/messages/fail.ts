import {MessageRecord} from "./types";
import {MessageModel} from "./model";

export const recordFailure = async (message: MessageRecord) => {
  const record = await MessageModel.findOne({
    where: {id: message.id}
  });

  if(!record) throw new Error('pending message not found');

  await record.update({
    attempts: record.attempts! + 1,
    lastAttemptAt: new Date()
  });
}
