// Sesión 10 · Tu primer test automatizado con Playwright
// Sitio: Toolshop (https://practicesoftwaretesting.com/)
import { test, expect } from '@playwright/test';

test('la página principal de Toolshop carga', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');

  await expect(page).toHaveTitle(/Toolshop/);
});

test('buscar un producto muestra resultados', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');

  // Antes de buscar, espera a que cargue la lista inicial de la portada. Si se busca antes,
  // la respuesta tardía de esa lista puede llegar después y reemplazar los resultados.
  await expect(page.getByTestId('product-name').first()).toBeVisible();

  // Busco "Sander" y no "Pliers": la portada ya muestra varios "Pliers" antes de buscar,
  // así que un expect sobre "Pliers" pasaría aunque la búsqueda estuviera rota.
  await page.getByPlaceholder('Search').fill('Sander');
  await page.getByRole('button', { name: 'Search' }).click();

  // Comprueba que la página confirma la búsqueda realizada...
  await expect(page.getByText('Searched for: Sander')).toBeVisible();
  // ...y que el primer producto listado corresponde a lo buscado.
  await expect(page.getByTestId('product-name').first()).toContainText('Sander');
});

test('abrir el primer producto muestra su detalle', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');

  const firstProduct = page.getByTestId('product-name').first();
  const productName = await firstProduct.textContent();
  await firstProduct.click();

  // Comprueba que navegó a la página de detalle del producto...
  await expect(page).toHaveURL(/\/product\//);
  // ...que el título de la página es el producto que se eligió...
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(productName.trim());
  // ...y que se puede agregar al carrito desde ahí.
  await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();
});
