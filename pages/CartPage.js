// Page Object del carrito (/cart.html).
// rowFor y quantityOf devuelven locators: la clase busca, el test verifica.
export class CartPage {
  constructor(page) {
    this.page = page;
    // En el carrito dice «Your Cart» (en el catálogo, «Products»).
    this.title = page.getByTestId('title');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  rowFor(name) {
    return this.page.getByTestId('inventory-item').filter({ hasText: name });
  }

  quantityOf(name) {
    return this.rowFor(name).getByTestId('item-quantity');
  }

  async startCheckout() {
    await this.checkoutButton.click();
  }
}
