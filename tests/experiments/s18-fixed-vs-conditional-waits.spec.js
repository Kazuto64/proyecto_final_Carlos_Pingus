// ⚠️ EXPERIMENTOS DE LABORATORIO — NO FORMAN PARTE DE LA SUITE
// Sesión 18 · Esperas condicionales y pruebas inestables (búsqueda de Toolshop)
//
// La misma comprobación con distintas esperas. Para comparar, quita el .skip de una y ejecuta:
//   npm run test:experiments -- --project=chromium --workers=1 --repeat-each=10 -g "<nombre>"
//
// | Espera                 | Resultado esperado con --repeat-each=10 | Qué es    |
// |------------------------|------------------------------------------|-----------|
// | Fija de 300 ms         | fallan casi todas                        | rota      |
// | Fija de 550 ms         | mezcla de verdes y rojos                 | inestable |
// | Fija de 1500 ms        | pasan, pero suman 15 s de espera inútil  | frágil    |
// | Condicional (sin skip) | pasan todas                              | estable   |
// La búsqueda tardó ~440 ms en el reconocimiento del 22/11; los números cambian según la red.
import { test, expect } from '@playwright/test';

test.use({ baseURL: process.env.SEARCH_URL });

const TERM = 'hammer';

// Lee los nombres una sola vez y comprueba que todos contienen el término.
// Si la lista todavía es la de la portada (Pliers, Bolt Cutters…), falla.
async function allNamesMatch(page) {
  const names = await page.getByTestId('product-name').allTextContents();
  return names.length > 0 && names.every((name) => name.toLowerCase().includes(TERM));
}

async function openAndSearch(page) {
  await page.goto('/');
  // Espera a que cargue la lista inicial (lección de la S11: si no, su respuesta tardía pisa la búsqueda).
  await expect(page.getByTestId('product-name').first()).toBeVisible();
  await page.getByLabel('Search').fill(TERM);
}

for (const ms of [300, 550, 1500]) {
  test.skip(`espera fija de ${ms} ms`, async ({ page }) => {
    await openAndSearch(page);
    await page.getByRole('button', { name: 'Search' }).click();
    await page.waitForTimeout(ms);
    expect(await allNamesMatch(page)).toBe(true);
  });
}

// Condicional: no le digo cuánto esperar, le digo qué hecho me interesa.
// 1) La respuesta de /products/search (la promesa se crea ANTES del clic y se espera después).
// 2) Que la lista ya muestre solo resultados (expect.poll: un valor calculado, no un elemento).
test('espera condicional con waitForResponse y expect.poll', async ({ page }) => {
  await openAndSearch(page);
  const response = page.waitForResponse(
    (res) => res.url().includes('/products/search') && res.status() === 200
  );
  await page.getByRole('button', { name: 'Search' }).click();
  await response;
  await expect.poll(() => allNamesMatch(page)).toBe(true);
});

// La trampa de toPass: todo lo que está dentro se repite en cada intento.
// Aquí el clic se repetiría en cada reintento. Regla: dentro de toPass, solo leer y comprobar.
test.skip('toPass con un clic adentro (trampa)', async ({ page }) => {
  await openAndSearch(page);
  await expect(async () => {
    await page.getByRole('button', { name: 'Search' }).click();
    expect(await allNamesMatch(page)).toBe(true);
  }).toPass();
});
