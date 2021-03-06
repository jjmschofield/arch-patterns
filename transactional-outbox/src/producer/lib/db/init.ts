import {Sequelize} from "sequelize";
import * as superheros from "../superhero";
import * as messages from "../messages";

let sequelize: Sequelize;

export const initDb = async () => {
  sequelize = new Sequelize(
    process.env.DB_CONNECTION_STRING || 'DB connection string not set',
    {
      logging: false,
    });

  await sequelize.authenticate(); // just tests that the connection works

  messages.init(sequelize);
  superheros.init(sequelize);
};

export const getDb = (): Sequelize => {
  return sequelize;
}
