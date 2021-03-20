import * as pendingMessage from "../pending-message";

export const syncDb = async () => {
 await pendingMessage.sync();
};
