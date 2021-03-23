import {Sequelize, DataTypes, Model} from 'sequelize';
import {SuperHeroRecord} from "./types";

export class SuperHeroModel extends Model {
  public id: string | undefined;
  public name: string | undefined;
  public createdAt: Date | undefined;
  public updatedAt: Date | undefined;

  toPojo(): SuperHeroRecord {
    return {
      id: this.id!,
      name: this.name!,
      createdAt: this.createdAt!,
      updatedAt: this.updatedAt!,
    }
  }
}

export const init = (sequelize: Sequelize) => {
  SuperHeroModel.init({
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    timestamps: true,
    modelName: 'SuperHero'
  });
}

export const sync = async () => {
  await SuperHeroModel.sync({ force: true }) // !!! Will drop existing table !!!
}

