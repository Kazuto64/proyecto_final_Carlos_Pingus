// Convierte un precio en texto («$29.99», «Item total: $1,029.99») en número.
// Quita todo lo que no sea dígito o punto: replace('$', '') dejaría la coma y daría NaN.
// Un solo lugar para esta regla: la usan HomePage y PaymentPage.
export function toNumber(text) {
  return Number(text.replace(/[^0-9.]/g, ''));
}
