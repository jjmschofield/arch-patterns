import {Context} from "koa";
import log from "../../lib/logger";
import {createSuperHero} from "../lib/superhero";
import {v4 as uuidv4} from "uuid";
import correlator from "correlation-id";
import {sendMessage} from "../lib/clients/receiver";
import {SuperHeroModel} from "../lib/superhero/model";

export const createSyncCtrl = async (ctx: Context, next: Function) => {
  try {
    const hero = await SuperHeroModel.create({name: ctx.request.body.name});

    const message = {
      id: uuidv4(),
      msg: ctx.request.body.msg,
      payload: {id: hero.id, name: hero.name, createdAt: hero.createdAt},
      correlation: correlator.getId() || 'NOT SET',
    }

    await sendMessage(message)

    ctx.status = 201;
  } catch (error) {
    log.error('CREATE_HERO_FAIL', 'failed to create hero sync', error);
    throw error;
  }
};
