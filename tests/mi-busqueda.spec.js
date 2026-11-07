// Sesión 11 · Localizadores y tipos de esperas
// Sitio: Toolshop (https://practicesoftwaretesting.com/)
//
// Mapa de localizadores (orden de preferencia de la S11: 1 getByRole … 6 CSS)
// | Elemento                       | Localizador elegido                           | Cat. | Por qué                                              |
// |--------------------------------|-----------------------------------------------|------|------------------------------------------------------|
// | Botón Search                   | getByRole('button', { name: 'Search' })       | 1    | Lo ve el usuario y rara vez cambia                   |
// | Campo de búsqueda              | getByLabel('Search')                          | 2    | Tiene <label> asociado; sobrevive a cambios de diseño |
// | Nombre del primer producto     | getByTestId('product-name').first()           | 5    | Marca para pruebas; hay varios, por eso .first()      |
// | Mensaje de que no hay productos| getByText('There are no products found.')     | 4    | Es lo que el usuario lee                             |
// | Nombres de todos los productos | getByTestId('product-name')                   | 5    | Misma marca para toda la lista; sirve con toHaveCount |
import { test, expect } from '@playwright/test';

test('el mapa de localizadores encuentra cinco elementos de Toolshop', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');

  await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
  await expect(page.getByLabel('Search')).toBeVisible();
  await expect(page.getByTestId('product-name').first()).toBeVisible();
  // La portada muestra una página de 9 productos.
  await expect(page.getByTestId('product-name')).toHaveCount(9);
  // Antes de buscar, el mensaje de "sin productos" no debe aparecer.
  await expect(page.getByText('There are no products found.')).not.toBeVisible();
});

test('buscar un producto inexistente no muestra resultados', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');

  // Antes de buscar, espera a que cargue la lista inicial de la portada. Si se busca antes,
  // la respuesta tardía de esa lista puede llegar después y reemplazar los resultados.
  await expect(page.getByTestId('product-name').first()).toBeVisible();

  await page.getByLabel('Search').fill('xyz');
  await page.getByRole('button', { name: 'Search' }).click();

  // Espera explícita: await expect reintenta hasta que aparece el mensaje.
  await expect(page.getByText('There are no products found.')).toBeVisible();
  // Se comprueba después del mensaje: si se comprobara solo esto, podría pasar mientras la lista aún carga.
  await expect(page.getByTestId('product-name')).toHaveCount(0);
});
