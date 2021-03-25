import {Context} from "koa";
import {getAllMessages} from "../messages";

export const callsCtrl = async (ctx: Context, next: Function) => {
  ctx.status = 200;
  ctx.body = {messages: getAllMessages()};
};
