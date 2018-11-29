import DataLoader from "dataloader";
import _keyBy from "lodash/keyBy";

async function batchCart(cartIds, db) {
  const products = await db.product.find({
    _id: {
      $in: cartIds
    }
  });

  const productByIds = _keyBy(products, "_id");
  return cartIds.map(cartId => productByIds[cartId]);
}

const cartLoader = db => {
  return new DataLoader(cartIds => batchCart(cartIds, db));
};

export const loaders = db => ({
  product: cartLoader(db)
});
