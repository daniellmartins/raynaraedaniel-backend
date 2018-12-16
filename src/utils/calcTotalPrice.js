export function calcTotalPrice(cart) {
  return cart.reduce((tally, item) => {
    if (!item.product) return tally;
    return tally + item.quantity * item.product.price;
  }, 0);
}
