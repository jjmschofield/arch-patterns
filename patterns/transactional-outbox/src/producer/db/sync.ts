import * as pendingMessage from "../models/pending-message";

export const syncDb = async () => {
 await pendingMessage.sync();
};
