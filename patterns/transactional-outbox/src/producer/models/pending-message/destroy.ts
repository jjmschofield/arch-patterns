import {PendingMessageModel} from "./model";

export const destroy = async (_id: string) : Promise<void> => {
  await PendingMessageModel.destroy({
    where:{
      _id: _id
    }
  });
};
