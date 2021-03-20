import {Sequelize, DataTypes, Model} from 'sequelize';
import {MessageRecord} from "./types";

export class PendingMessageModel extends Model {
  public _id: string | undefined;
  public id: string | undefined;
  public msg: string | undefined;
  public attempts: number | undefined;
  public lastAttempt: Date | undefined;
  public lockedAt: Date | undefined;
  public createdAt: Date | undefined;
  public updatedAt: Date | undefined;
  public correlation: string | undefined;

  toPojo(): MessageRecord {
    return {
      _id: this._id!,
      id: this.id!,
      msg: this.msg!,
      correlation: this.correlation!,
      attempts: this.attempts!,
      lastAttemptAt: this.lastAttempt!,
      lockedAt: this.lockedAt!,
      createdAt: this.createdAt!,
      updatedAt: this.updatedAt!,
    }
  }
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

