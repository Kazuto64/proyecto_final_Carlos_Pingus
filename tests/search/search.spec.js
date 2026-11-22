// Búsqueda en Toolshop (https://practicesoftwaretesting.com/), trabajada en las sesiones 10 y 11.
// Toolshop no es parte del sistema del proyecto (Swag Labs): sus casos llevan IDs propios, CP-BUSQ-XX.
//
// Mapa de localizadores (orden de preferencia de la S11: 1 getByRole … 6 CSS). Desde la S20 viven en pages/SearchPage.js.
// | Elemento                        | Localizador elegido                       | Cat. | Por qué                                               |
// |---------------------------------|-------------------------------------------|------|-------------------------------------------------------|
// | Botón Search                    | getByRole('button', { name: 'Search' })   | 1    | Lo ve el usuario y rara vez cambia                    |
// | Campo de búsqueda               | getByLabel('Search')                      | 2    | Tiene <label> asociado; sobrevive a cambios de diseño |
// | Nombre del primer producto      | getByTestId('product-name').first()       | 5    | Marca para pruebas; hay varios, por eso .first()      |
// | Mensaje de que no hay productos | getByText('There are no products found.') | 4    | Es lo que el usuario lee                              |
// | Nombres de todos los productos  | getByTestId('product-name')               | 5    | Misma marca para toda la lista; sirve con toHaveCount |
import { test, expect } from '../fixtures.js';
import searchData from '../../test-data/search-data.json';

// Regla local: solo este archivo usa la dirección de Toolshop; el resto conserva BASE_URL (Swag Labs).
test.use({ baseURL: process.env.SEARCH_URL });

const { existingTerm, missingTerm, homePageSize } = searchData;

test.describe('Búsqueda en Toolshop', () => {
  test.beforeEach(async ({ searchPage }) => {
    await searchPage.goto();
  });

  test('CP-BUSQ-01: la página principal carga con el título de Toolshop', async ({ page }) => {
    await expect(page).toHaveTitle(/Toolshop/);
  });

  test('CP-BUSQ-02: el mapa de localizadores encuentra los elementos de la portada', async ({ searchPage }) => {
    await expect(searchPage.searchButton).toBeVisible();
    await expect(searchPage.searchBox).toBeVisible();
    await expect(searchPage.productNames.first()).toBeVisible();
    await expect(searchPage.productNames).toHaveCount(homePageSize);
    // Antes de buscar, el mensaje de «sin productos» no debe aparecer.
    await expect(searchPage.noResults).not.toBeVisible();
  });

  test('CP-BUSQ-03: buscar un producto existente muestra resultados que lo contienen', async ({ searchPage }) => {
    // Se busca «Sander» y no «Pliers»: la portada ya muestra varios «Pliers» antes de buscar,
    // así que un expect sobre «Pliers» pasaría aunque la búsqueda estuviera rota.
    await searchPage.search(existingTerm);

    await expect(searchPage.searchCaption(existingTerm)).toBeVisible();
    await expect(searchPage.productNames.first()).toContainText(existingTerm);
  });

  test('CP-BUSQ-04: buscar un producto inexistente muestra el mensaje y ningún producto', async ({ searchPage }) => {
    await searchPage.search(missingTerm);

    await expect(searchPage.noResults).toBeVisible();
    // Se comprueba después del mensaje: solo con esto podría pasar mientras la lista aún carga.
    await expect(searchPage.productNames).toHaveCount(0);
  });

  test('CP-BUSQ-05: abrir el primer producto muestra su detalle', async ({ page, searchPage }) => {
    const firstProduct = searchPage.productNames.first();
    const productName = await firstProduct.textContent();
    await firstProduct.click();

    await expect(page).toHaveURL(/\/product\//);
    await expect(searchPage.productTitle).toHaveText(productName.trim());
    await expect(searchPage.addToCartButton).toBeVisible();
  });
});
