import {PendingMessageModel} from "./model";
import {MessageRecord} from "./types";

export const destroy = async (message: MessageRecord) : Promise<void> => {
  await PendingMessageModel.destroy({
    where:{
      _id: message._id
    }
  });
};
