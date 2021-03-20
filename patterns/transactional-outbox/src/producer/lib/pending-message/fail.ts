import {Message} from "./types";
import {PendingMessageModel} from "./model";

export const recordFailure = async (message: Message) => {
  const record = await PendingMessageModel.findOne({
    where: {_id: message._id}
  });

  if(!record) throw new Error('pending message not found');

  await record.update({
    attempts: record.attempts! + 1,
    lastAttempt: new Date()
  });
}
