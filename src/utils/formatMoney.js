export function formatMoney(amount, one = ".", two = ",") {
  return amount
    .toFixed(2)
    .replace(one, two)
    .toLocaleString("pt-BR");
}
