import 'source-map-support/register';
import Router from "koa-router";

import log from '../lib/logger';
import config from '../lib/config';
import {createApp, startHttpServer} from "../lib/koa";
import {sendSyncCtrl} from "./routes/sendSync";

export const server = async () => {
  const router = new Router();

  router.post('/send-sync', sendSyncCtrl);

  const app = createApp(router);

  startHttpServer(app, process.env.HTTP_PORT || '80');
};

(async () => {
  try {
    await config.load();
    process.title = process.env.PROC_TITLE || 'node';
    await server();
  }
  catch (error) {
    log.error('UNHANDLED_ERROR', 'An unhandled exception has caused the app to terminate', { error });
    process.exit(1);
  }
})();
