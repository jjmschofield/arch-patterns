import Koa from "koa";
import http from "http";

export const startHttpServer = (app: Koa, port: string) => {
  http.createServer(app.callback()).listen(port);
};
