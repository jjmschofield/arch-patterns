import {name} from 'faker';
import {Sequelize, DataTypes, Model} from 'sequelize';
import log from '@common/logger';
import {PersonRecord} from './types';


export class PersonModel extends Model {
  public id: string | undefined;
  public name: string | undefined;
  public createdAt: Date | undefined;
  public updatedAt: Date | undefined;

  toPojo(): PersonRecord {
    return {
      id: this.id!,
      name: this.name!,
      createdAt: this.createdAt!,
      updatedAt: this.updatedAt!,
    };
  }
}

export const init = (sequelize: Sequelize) => {
  PersonModel.init({
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: true,
    modelName: 'people',
  });
};

export const sync = async () => {
  await PersonModel.sync({force: true}); // !!! Will drop existing table !!!
  await seed();
};

const seed = async () => {
  const required = parseInt(process.env.SEED_COUNT || '20000', 10);

  log.info('PERSON_SEED_START', `Starting to seed the database with ${required} people`, {required});

  const records = [];

  for (let i = 0; i < required; i++) {
    records.push(createRandom());
  }

  await PersonModel.bulkCreate(records);

  const resulting = await PersonModel.count();

  log.info('PERSON_SEED_COMPLETE', `Seeded the database with ${resulting} people`, {resulting, required});
};

const createRandom = () => {
  return {
    name: `${name.findName()}`,
  };
};
