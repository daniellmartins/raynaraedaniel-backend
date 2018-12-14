import DataLoader from "dataloader";
import _keyBy from "lodash/keyBy";

async function batchProduct(userId, db) {
  const carts = await db.cart.find({
    userId
  });

  const cartByIds = _keyBy(carts, "_id");
  return carts.map(cartId => cartByIds[cartId]);
}

async function batchCart(cartIds, db) {
  const products = await db.product.find({
    _id: {
      $in: cartIds
    }
  });

  const productByIds = _keyBy(products, "_id");
  return cartIds.map(cartId => productByIds[cartId]);
}

const productLoader = db => {
  return new DataLoader(userId => batchProduct(userId, db));
};

const cartLoader = db => {
  return new DataLoader(cartIds => batchCart(cartIds, db));
};

export const loaders = db => ({
  product: cartLoader(db),
  cart: productLoader(db)
});
