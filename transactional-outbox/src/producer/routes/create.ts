import {Context} from "koa";
import log from "@common/logger";
import {createSuperHero} from "../lib/superhero";

export const createCtrl = async (ctx: Context, next: Function) => {
  try {
    await createSuperHero(ctx.request.body.name);

    ctx.status = 201;
  } catch (error) {
    log.error('CREATE_HERO_FAIL', 'failed to create hero', error);
    throw error;
  }
};
