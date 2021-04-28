import * as product from '../product';

export const syncDb = async () => {
  await product.sync();
};
