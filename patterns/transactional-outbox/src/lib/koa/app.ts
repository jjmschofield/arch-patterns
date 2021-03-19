import Koa, {Context} from 'koa';
import Router from 'koa-router';
import helmet from 'koa-helmet';
import cors from 'koa-cors';

import {setCorrelationId, setReqTime, errorHandler, logRequest} from './middleware';

import {healthCtrl} from "./controllers/health/health";

export const createApp = (): { app: Koa, router: Router } => {
  const app = new Koa();
  applyLoggingMiddleware(app);
  applyErrorHandlers(app);
  applySecurityMiddleware(app);
  applyResponseHeaders(app);

  const router = new Router();

  router.get('/health', healthCtrl);

  return { app, router };
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
