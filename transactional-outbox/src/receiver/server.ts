import 'source-map-support/register';
import 'module-alias/register';

import Router from "koa-router";

import log from '@common/logger';
import config from '@common/config';
import {createApp, startHttpServer} from "@common/koa";
import {receiveCtrl, callsCtrl} from "./routes";

export const server = async () => {
  const router = new Router();

  const app = createApp(router);

  router.post('/receive', receiveCtrl);
  router.get('/messages', callsCtrl);

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
