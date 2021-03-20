import config from "../lib/config";
import log from "../lib/logger";
import {getDb, initDb} from "./lib/db";
import {startSendingMessages} from "./lib/messages";
import {sendMessage} from "./lib/clients/receiver";

export const start = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      startSendingMessages(sendMessage);
    } catch (error) {
      reject(error);
    }
  });
};

export const db = async () => {
  await initDb();
}

(async () => {
  try {
    await config.load();
    process.title = process.env.PROC_TITLE || 'node';
    await db();
    await start();
  } catch (error) {
    log.error('UNHANDLED_ERROR', 'An unhandled exception has caused the app to terminate', {error});
    await getDb().close();
    process.exit(1);
  }
})();
