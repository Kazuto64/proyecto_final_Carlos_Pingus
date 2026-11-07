// Page Object del detalle de un producto (/inventory-item.html?id=N).
export class ProductPage {
  constructor(page) {
    this.page = page;
    // En el detalle el nombre no es un heading: es un texto con data-test.
    this.title = page.getByTestId('inventory-item-name');
    // getByRole('button', { name: 'Add to cart' }) también encuentra los 6 botones del catálogo
    // si la página anterior sigue en pantalla: «strict mode violation». El data-test 'add-to-cart'
    // existe solo en el detalle (en el catálogo es 'add-to-cart-<producto>').
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.removeButton = page.getByTestId('remove');
    // Swag Labs no muestra un aviso al agregar; la señal es el contador del carrito.
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    // Solo existe en el detalle: sirve para saber que la página ya se dibujó.
    this.backButton = page.getByRole('button', { name: 'Back to products' });
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async openCart() {
    await this.cartLink.click();
  }
}
