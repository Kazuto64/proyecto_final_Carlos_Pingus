// ⚠️ EXPERIMENTOS DE LABORATORIO — NO FORMAN PARTE DE LA SUITE
// Sesión 11 · Localizadores y tipos de esperas (Toolshop)
//
// Estos tests rompen algo a propósito para ver el error que produce Playwright.
// Están excluidos de `npm test` y además marcados con test.skip.
// Para ver uno: quita el .skip y ejecuta
//   npm run test:experiments -- --project=chromium -g "<nombre del test>"
import { test, expect } from '@playwright/test';

const TOOLSHOP = 'https://practicesoftwaretesting.com/';

// ── Parte 2: modo estricto ───────────────────────────────────────────────────

// Error esperado: strict mode violation: getByTestId('product-name') resolved to 9 elements
// Traducción: «encontré 9, ¿cuál quieres?». No es un fallo de Playwright: el localizador es ambiguo.
test.skip('modo estricto: clic en un localizador que encuentra varios productos', async ({ page }) => {
  await page.goto(TOOLSHOP);
  await page.getByTestId('product-name').click();
});

// Solución 1, por posición. Funciona, pero se rompe si Toolshop cambia el orden de los productos.
test('modo estricto resuelto por posición con .first()', async ({ page }) => {
  await page.goto(TOOLSHOP);
  await page.getByTestId('product-name').first().click();
  await expect(page).toHaveURL(/\/product\//);
});

// Solución 2, por texto. Sobrevive a un cambio de orden: busca el producto por su nombre.
// Sigue necesitando .first(): «Pliers» aparece en varios nombres (Combination Pliers, Long Nose Pliers…).
test('modo estricto resuelto por texto con .filter()', async ({ page }) => {
  await page.goto(TOOLSHOP);
  await page.getByTestId('product-name').filter({ hasText: 'Pliers' }).first().click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Pliers');
});

// ── Parte 3: romper la assertion a propósito ────────────────────────────────

// Error esperado: Expected: 1 · Received: 0. Demuestra que toHaveCount(0) de CP-BUSQ-04 sí puede fallar.
test.skip('assertion rota: espera 1 producto cuando la búsqueda no tiene resultados', async ({ page }) => {
  await page.goto(TOOLSHOP);
  await page.getByLabel('Search').fill('xyz');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByTestId('product-name')).toHaveCount(1);
});

// ── Parte 4: tres formas de esperar (ejecutar con --repeat-each=10) ─────────

// 1. Lectura única: expect(await ...) mira una sola vez y no espera.
//    Si la búsqueda tarda un poco, falla aunque la aplicación funcione bien.
test.skip('espera: lectura única con expect(await ...isVisible())', async ({ page }) => {
  await page.goto(TOOLSHOP);
  await page.getByLabel('Search').fill('xyz');
  await page.getByRole('button', { name: 'Search' }).click();
  expect(await page.getByText('There are no products found.').isVisible()).toBe(true);
});

// 2. Espera fija: duerme siempre 3 s, haga falta o no. Suma 3 s × 10 repeticiones = 30 s de más.
test.skip('espera: fija con waitForTimeout antes de la lectura', async ({ page }) => {
  await page.goto(TOOLSHOP);
  await page.getByLabel('Search').fill('xyz');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.waitForTimeout(3000);
  expect(await page.getByText('There are no products found.').isVisible()).toBe(true);
});

// 3. La versión correcta (espera explícita) vive en tests/search/search.spec.js (CP-BUSQ-04):
//      await expect(page.getByText('There are no products found.')).toBeVisible();
//    La espera implícita está en fill() y click(): Playwright espera a que el elemento sea accionable.
