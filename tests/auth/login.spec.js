// Flujo de autenticación en Swag Labs.
// Casos: CP-SL-211, CP-SL-212 y, desde test-data/data-login.json, CP-SL-201, 202 y 215
// (R1 en docs/matriz-trazabilidad-v1.md).
import { test, expect } from '../fixtures.js';
import { HomePage } from '../../pages/HomePage.js';
import invalidLogins from '../../test-data/data-login.json';

test.describe('Autenticación', () => {
  test('CP-SL-211: login exitoso lleva al catálogo de productos', async ({ page, loginPage, credentials }) => {
    await loginPage.login(credentials.user, credentials.password);

    // Los locators viven en HomePage; aquí no se pide la fixture homePage porque haría su propio login.
    const homePage = new HomePage(page);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(homePage.title).toHaveText('Products');
    await expect(homePage.openMenuButton).toBeVisible();
  });

  test('CP-SL-212: cerrar sesión vuelve al login', async ({ homePage, loginPage }) => {
    await homePage.logout();

    // «Estamos en el login» se comprueba con el botón Login, no con el dominio: el dominio vive en .env.
    await expect(loginPage.loginButton).toBeVisible();
    await expect(homePage.title).toBeHidden();
  });

  // Data-driven: un for que crea un test por fila (no un bucle dentro de un test).
  // Caso nuevo = fila nueva en el JSON. Los datos falsos viajan en el JSON;
  // si una fila no trae user o password, ?? usa el de la cuenta real, que llega desde .env.
  for (const { id, name, user, password, error } of invalidLogins) {
    test(`${id}: ${name}`, async ({ loginPage, credentials }) => {
      await loginPage.login(user ?? credentials.user, password ?? credentials.password);

      await expect(loginPage.errorMessage).toHaveText(error);
      // Seguimos en el login: el mensaje solo tiene sentido si no entró.
      await expect(loginPage.loginButton).toBeVisible();
    });
  }
});
