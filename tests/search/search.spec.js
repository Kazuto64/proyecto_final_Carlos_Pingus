// Búsqueda en Toolshop (https://practicesoftwaretesting.com/), trabajada en las sesiones 10 y 11.
// Toolshop no es parte del sistema del proyecto (Swag Labs): sus casos llevan IDs propios, CP-BUSQ-XX.
//
// Mapa de localizadores (orden de preferencia de la S11: 1 getByRole … 6 CSS)
// | Elemento                        | Localizador elegido                       | Cat. | Por qué                                               |
// |---------------------------------|-------------------------------------------|------|-------------------------------------------------------|
// | Botón Search                    | getByRole('button', { name: 'Search' })   | 1    | Lo ve el usuario y rara vez cambia                    |
// | Campo de búsqueda               | getByLabel('Search')                      | 2    | Tiene <label> asociado; sobrevive a cambios de diseño |
// | Nombre del primer producto      | getByTestId('product-name').first()       | 5    | Marca para pruebas; hay varios, por eso .first()      |
// | Mensaje de que no hay productos | getByText('There are no products found.') | 4    | Es lo que el usuario lee                              |
// | Nombres de todos los productos  | getByTestId('product-name')               | 5    | Misma marca para toda la lista; sirve con toHaveCount |
import { test, expect } from '@playwright/test';

// Regla local: solo este archivo usa la dirección de Toolshop; el resto conserva BASE_URL (Swag Labs).
test.use({ baseURL: process.env.SEARCH_URL });

const SEARCH_TERM = 'Sander';
const MISSING_TERM = 'xyz';

test.describe('Búsqueda en Toolshop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Espera a que cargue la lista inicial de la portada antes de cualquier búsqueda. Si se busca antes,
    // la respuesta tardía de esa lista puede llegar después y reemplazar los resultados (falla intermitente).
    await expect(page.getByTestId('product-name').first()).toBeVisible();
  });

  test('CP-BUSQ-01: la página principal carga con el título de Toolshop', async ({ page }) => {
    await expect(page).toHaveTitle(/Toolshop/);
  });

  test('CP-BUSQ-02: el mapa de localizadores encuentra los elementos de la portada', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
    await expect(page.getByLabel('Search')).toBeVisible();
    await expect(page.getByTestId('product-name').first()).toBeVisible();
    // La portada muestra una página de 9 productos.
    await expect(page.getByTestId('product-name')).toHaveCount(9);
    // Antes de buscar, el mensaje de «sin productos» no debe aparecer.
    await expect(page.getByText('There are no products found.')).not.toBeVisible();
  });

  test('CP-BUSQ-03: buscar un producto existente muestra resultados que lo contienen', async ({ page }) => {
    // Se busca «Sander» y no «Pliers»: la portada ya muestra varios «Pliers» antes de buscar,
    // así que un expect sobre «Pliers» pasaría aunque la búsqueda estuviera rota.
    await page.getByLabel('Search').fill(SEARCH_TERM);
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page.getByText(`Searched for: ${SEARCH_TERM}`)).toBeVisible();
    await expect(page.getByTestId('product-name').first()).toContainText(SEARCH_TERM);
  });

  test('CP-BUSQ-04: buscar un producto inexistente muestra el mensaje y ningún producto', async ({ page }) => {
    await page.getByLabel('Search').fill(MISSING_TERM);
    await page.getByRole('button', { name: 'Search' }).click();

    // Espera explícita: await expect reintenta hasta que aparece el mensaje.
    await expect(page.getByText('There are no products found.')).toBeVisible();
    // Se comprueba después del mensaje: solo con esto podría pasar mientras la lista aún carga.
    await expect(page.getByTestId('product-name')).toHaveCount(0);
  });

  test('CP-BUSQ-05: abrir el primer producto muestra su detalle', async ({ page }) => {
    const firstProduct = page.getByTestId('product-name').first();
    const productName = await firstProduct.textContent();
    await firstProduct.click();

    await expect(page).toHaveURL(/\/product\//);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(productName.trim());
    await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  });
});
