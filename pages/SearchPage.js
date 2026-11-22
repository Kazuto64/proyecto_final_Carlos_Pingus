// Page Object de la portada y la búsqueda de Toolshop (SEARCH_URL).
import { expect } from '@playwright/test';

export class SearchPage {
  constructor(page) {
    this.page = page;
    this.searchBox = page.getByLabel('Search');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.productNames = page.getByTestId('product-name');
    this.noResults = page.getByText('There are no products found.');
    // Detalle de un producto
    this.productTitle = page.getByRole('heading', { level: 1 });
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
  }

  searchCaption(term) {
    return this.page.getByText(`Searched for: ${term}`);
  }

  // Abre la portada y espera a que cargue la lista inicial. Si se busca antes, la respuesta tardía
  // de esa lista puede llegar después y reemplazar los resultados (falla intermitente de la S11).
  // Excepción consciente a «sin expect en la clase»: espera un estado para sincronizar, no verifica negocio.
  async goto() {
    await this.page.goto('/');
    await expect(this.productNames.first()).toBeVisible();
  }

  // Espera condicional de la S18: la respuesta de /products/search, creada antes del clic y esperada después.
  async search(term) {
    await this.searchBox.fill(term);
    const response = this.page.waitForResponse(
      (res) => res.url().includes('/products/search') && res.status() === 200
    );
    await this.searchButton.click();
    await response;
  }
}
