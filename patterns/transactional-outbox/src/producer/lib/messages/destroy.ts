import {MessageModel} from "./model";
import {MessageRecord} from "./types";

export const destroy = async (message: MessageRecord) : Promise<void> => {
  await MessageModel.destroy({
    where:{
      id: message.id
    }
  });
};
