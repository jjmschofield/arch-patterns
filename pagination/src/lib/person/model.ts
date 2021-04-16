import { name } from 'faker';
import { Sequelize, DataTypes, Model } from 'sequelize';
import { PersonRecord } from './types';

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
  await PersonModel.sync({ force: true }); // !!! Will drop existing table !!!
};

export const seed = async (count: number) => {
  const records = [];

  for (let i = 0; i < count; i++) {
    records.push(createRandom());
  }

  await PersonModel.bulkCreate(records);
};

const createRandom = () => {
  return {
    name: `${name.findName()}`,
  };
};
