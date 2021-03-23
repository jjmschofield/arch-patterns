import {Sequelize, DataTypes, Model} from 'sequelize';
import {MessageRecord} from "./types";

export class MessageModel extends Model {
  public id: string | undefined;
  public msg: string | undefined;
  public payload: object | undefined;
  public attempts: number | undefined;
  public lastAttemptAt: Date | undefined;
  public lockedAt: Date | undefined;
  public createdAt: Date | undefined;
  public updatedAt: Date | undefined;
  public correlation: string | undefined;

  toPojo(): MessageRecord {
    return {
      id: this.id!,
      msg: this.msg!,
      payload: this.payload!,
      correlation: this.correlation!,
      attempts: this.attempts!,
      lastAttemptAt: this.lastAttemptAt!,
      lockedAt: this.lockedAt!,
      createdAt: this.createdAt!,
      updatedAt: this.updatedAt!,
    }
  }
}

export const init = (sequelize: Sequelize) => {
  MessageModel.init({
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    msg: {
      type: DataTypes.STRING,
      allowNull: false
    },
    payload: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lastAttemptAt: {
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
    modelName: 'Message'
  });
}

export const sync = async () => {
  await MessageModel.sync({ force: true }) // !!! Will drop existing table !!!
}

