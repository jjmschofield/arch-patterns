import {Sequelize, DataTypes, Model} from 'sequelize';

export class PendingMessageModel extends Model {
  public id: string | undefined;
  public msg: string | undefined;
  public attempts: number | undefined;
  public lastAttempt: Date | undefined;
  public lockedAt: Date | undefined;
  public correlation: string | undefined;
  public _id: string | undefined;
}

export const init = (sequelize: Sequelize) => {
  PendingMessageModel.init({
    _id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    msg: {
      type: DataTypes.STRING,
      allowNull: false
    },
    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lastAttempt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lockedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    correlation: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    timestamps: true,
    modelName: 'PendingMessage'
  });
}

export const sync = async () => {
  await PendingMessageModel.sync({alter: true})
}

