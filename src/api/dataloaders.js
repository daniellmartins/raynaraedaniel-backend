import DataLoader from "dataloader";
import _ from "lodash";

async function batchCart(cartIds, db) {
  const products = await db.product.find({
    _id: {
      $in: cartIds
    }
  });

  const productByIds = _.keyBy(products, "_id");
  return cartIds.map(cartId => productByIds[cartId]);
}

const cartLoader = db => {
  return new DataLoader(cartIds => batchCart(cartIds, db));
};

export const loaders = db => ({
  product: cartLoader(db)
});
