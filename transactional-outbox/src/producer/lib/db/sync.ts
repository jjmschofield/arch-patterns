import * as messages from "../messages";
import * as superheros from "../superhero";

export const syncDb = async () => {
  await superheros.sync();
  await messages.sync();
};
