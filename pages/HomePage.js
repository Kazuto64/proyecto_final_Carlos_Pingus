// Page Object del catálogo de Swag Labs (Products, /inventory.html): la «portada» después del login.
export class HomePage {
  constructor(page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.openMenuButton = page.getByRole('button', { name: 'Open Menu' });
    // En Swag Labs «Logout» es un enlace con role="button".
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async openProduct(name) {
    // Cada producto tiene dos enlaces con el mismo nombre accesible (imagen y título):
    // getByRole('button', { name }) daría «strict mode violation». Se usa el nombre visible del título.
    await this.page.getByTestId('inventory-item-name').filter({ hasText: name }).click();
  }

  async logout() {
    await this.openMenuButton.click();
    await this.logoutButton.click();
  }
}
