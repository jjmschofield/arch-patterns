import * as pendingMessage from "../messages";

export const syncDb = async () => {
 await pendingMessage.sync();
};
