import {createMessage} from '../messages';
import {getDb} from "../db";
import correlator from "correlation-id";
import {SuperHeroModel} from "./model";
import {SuperHeroRecord} from "./types";
import log from "@common/logger";

export const createSuperHero = async (name: string): Promise<SuperHeroRecord> => {
  const transaction = await getDb().transaction();

  try {
    const hero = await SuperHeroModel.create({name}, {transaction});

    const message = await createMessage({
        msg: 'HERO_CREATED',
        payload: {id: hero.id, name: hero.name, createdAt: hero.createdAt},
        correlation: correlator.getId() || 'NOT SET'
      },
      transaction,
    );

    await transaction.commit();

    log.info('HERO_CREATED', 'created a new hero and placed message in outbox', {id: hero.id, msgId: message.id});

    return hero.toPojo();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

