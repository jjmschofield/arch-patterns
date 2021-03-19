import 'source-map-support/register';
import Router from "koa-router";

import log from '../lib/logger';
import config from '../lib/config';
import {createApp, startHttpServer} from "../lib/koa";
import {receiveCtrl} from "./routes/receive";

export const server = async () => {
  const router = new Router();

  const app = createApp(router);

  router.post('/receive', receiveCtrl);

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
