import { commerce, date } from 'faker';
import { Sequelize, DataTypes, Model } from 'sequelize';
import log from '@common/logger';
import { ProductRecord } from './types';

export class ProductModel extends Model {
  public id: string | undefined;
  public name: string | undefined;
  public color: string | undefined;
  public material: string | undefined;
  public price: number | undefined;
  public createdAt: Date | undefined;
  public updatedAt: Date | undefined;

  toPojo(): ProductRecord {
    return {
      id: this.id!,
      name: this.name!,
      color: this.color!,
      material: this.material!,
      price: this.price!,
      createdAt: this.createdAt!,
      updatedAt: this.updatedAt!,
    };
  }
}

export const init = (sequelize: Sequelize) => {
  ProductModel.init({
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
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    material: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      get() {
        const value = this.getDataValue('price');
        return value === null ? null : parseFloat(value);
      },
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    timestamps: true,
    underscored: true,
    modelName: 'product',
  });
};

export const sync = async () => {
  await ProductModel.sync({ force: true }); // !!! Will drop existing table !!!
  await seed();
};

const seed = async () => {
  const required = parseInt(process.env.SEED_COUNT || '20000', 10);

  log.info('PRODUCT_SEED_START', `Starting to seed the database with ${required} products`, { required });

  const records = [];

  for (let i = 0; i < required; i++) {
    records.push(createRandom());
  }

  await ProductModel.bulkCreate(records);

  const resulting = await ProductModel.count();

  log.info('PRODUCT_SEED_COMPLETE', `Seeded the database with ${resulting} products`, { resulting, required });
};

const createRandom = () => {
  return {
    name: `${commerce.productName()}`,
    color: `${commerce.color()}`,
    material: `${commerce.productMaterial()}`,
    price: `${commerce.price()}`,
    updatedAt: date.soon(),
    createdAt: date.past(),
  };
};
