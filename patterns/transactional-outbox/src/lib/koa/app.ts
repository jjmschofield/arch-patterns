import Koa from 'koa';
import helmet from 'koa-helmet';
import cors from 'koa-cors';
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import * as Boom from "@hapi/boom";

import {setCorrelationId, setReqTime, errorHandler, logRequest} from './middleware';
import {processCtrl} from "./controllers/process/process";

export const createApp = (router: Router): Koa => {
  const app = new Koa();

  app.use(setCorrelationId);
  app.use(logRequest);
  app.use(errorHandler);
  app.use(helmet());
  app.use(cors());
  app.use(setReqTime);
  app.use(bodyParser());


  router.get('/process-info', processCtrl);

  app.use(router.routes());

  app.use(router.allowedMethods({
    throw: true,
    methodNotAllowed: Boom.methodNotAllowed,
    notImplemented: Boom.notImplemented,
  }));

  return app;
};
