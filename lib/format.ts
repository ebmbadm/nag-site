const rub = new Intl.NumberFormat("ru-RU");

/** Format an integer rouble amount with thin-space grouping. */
export function formatPrice(amount: number, currency = "₽") {
  return `${rub.format(amount)} ${currency}`;
}
