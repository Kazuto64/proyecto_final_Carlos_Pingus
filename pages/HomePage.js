// Page Object del catálogo de Swag Labs (Products, /inventory.html): la «portada» después del login.
import { toNumber } from './price.js';

export class HomePage {
  constructor(page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.openMenuButton = page.getByRole('button', { name: 'Open Menu' });
    // En Swag Labs «Logout» es un enlace con role="button".
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.sortSelect = page.getByTestId('product-sort-container');
    this.productPrices = page.getByTestId('inventory-item-price');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async openProduct(name) {
    // Cada producto tiene dos enlaces con el mismo nombre accesible (imagen y título):
    // getByRole('button', { name }) daría «strict mode violation». Se usa el nombre visible del título.
    await this.page.getByTestId('inventory-item-name').filter({ hasText: name }).click();
  }

  // label: el texto visible de la opción, p. ej. «Price (low to high)».
  async sortBy(label) {
    await this.sortSelect.selectOption({ label });
  }

  // Devuelve los precios en el orden en que se ven. No verifica nada: eso lo hace el test.
  async prices() {
    const texts = await this.productPrices.allTextContents();
    return texts.map(toNumber);
  }

  async logout() {
    await this.openMenuButton.click();
    await this.logoutButton.click();
  }
}
