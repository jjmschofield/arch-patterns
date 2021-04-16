import 'source-map-support/register';
import 'module-alias/register';

import Router from 'koa-router';

import log from '@common/logger';
import config from '@common/config';
import { createApp, startHttpServer } from '@common/koa';
import { initDb, syncDb, getDb } from './lib/db';

export const server = async () => {
  const router = new Router();

  const app = createApp(router);

  startHttpServer(app, process.env.HTTP_PORT || '80');
};

export const db = async () => {
  await initDb();
  await syncDb();
};

(async () => {
  try {
    await config.load();
    process.title = process.env.PROC_TITLE || 'node';
    await db();
    await server();
  } catch (error) {
    log.error('UNHANDLED_ERROR', 'An unhandled exception has caused the app to terminate', { error });
    await getDb().close();
    process.exit(1);
  }
})();
