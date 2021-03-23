import {MessageRecord} from "./types";
import {MessageModel} from "./model";
import {Transaction} from "sequelize";

interface NewMessagePartial {
  msg: string,
  correlation: string,
  payload?: object,
}

export const createMessage = async (message: NewMessagePartial, transaction?: Transaction): Promise<MessageRecord> => {
  const record = await MessageModel.create({
      msg: message.msg,
      correlation: message.correlation,
      payload: message.payload || null,
    },
    {
      transaction
    }
  );

  return record.toPojo();
};
