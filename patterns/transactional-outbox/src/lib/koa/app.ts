import Koa from 'koa';
import helmet from 'koa-helmet';
import cors from 'koa-cors';
import Router from "koa-router";
import * as Boom from "@hapi/boom";

import {setCorrelationId, setReqTime, errorHandler, logRequest} from './middleware';
import {processCtrl} from "./controllers/process/process";

export const createApp = (router: Router): Koa => {
  const app = new Koa();

  applyLoggingMiddleware(app);

  applyErrorHandlers(app);

  applySecurityMiddleware(app);

  applyResponseHeaders(app);

  router.get('/process-info', processCtrl);

  app.use(router.routes());

  app.use(router.allowedMethods({
    throw: true,
    methodNotAllowed: Boom.methodNotAllowed,
    notImplemented: Boom.notImplemented,
  }));

  return app;
};

export const applyLoggingMiddleware = (app: Koa): Koa => {
  app.use(setCorrelationId);
  app.use(logRequest);
  return app;
};

export const applyResponseHeaders = (app: Koa): Koa => {
  app.use(setReqTime);
  return app;
};

export const applyErrorHandlers = (app: Koa): Koa => {
  app.use(errorHandler);
  return app;
};

export const applySecurityMiddleware = (app: Koa): Koa => {
  app.use(helmet());
  app.use(cors());
  return app;
};
