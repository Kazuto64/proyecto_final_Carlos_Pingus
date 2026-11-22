// Page Object de «Checkout: Overview» (/checkout-step-two.html) y de su resultado, «Checkout: Complete!».
// En Swag Labs el pago no se llena: el resumen muestra la tarjeta de prueba, los montos y el botón Finish.
import { toNumber } from './price.js';

export class PaymentPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.paymentInfo = page.getByTestId('payment-info-value');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    // Resultado del pedido (pantalla Complete).
    this.orderConfirmation = page.getByRole('heading', { name: 'Thank you for your order!' });
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  // Lee los tres montos del resumen. Llamar cuando el resumen ya está en pantalla.
  async amounts() {
    return {
      subtotal: toNumber(await this.subtotal.textContent()),
      tax: toNumber(await this.tax.textContent()),
      total: toNumber(await this.total.textContent()),
    };
  }

  async prices() {
    const texts = await this.itemPrices.allTextContents();
    return texts.map(toNumber);
  }

  async confirmOrder() {
    await this.finishButton.click();
  }
}
