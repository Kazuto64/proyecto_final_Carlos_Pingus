// Sesión 13 · Un proyecto ordenado: carpetas, .env y Page Object
// Sitio: Swag Labs (BASE_URL en .env). Casos: CP-SL-211, 201, 202 y 212 (nuevo: cerrar sesión).
//
// Mismos expect de la S12; cambió cómo se llega a ellos:
//   - la URL vive en .env (baseURL), las credenciales reales también (process.env),
//   - los locators viven en pages/LoginPage.js: si cambia uno, se corrige en una sola línea.
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';

test.describe('Autenticación', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('login exitoso', async ({ page }) => {
    await loginPage.login(process.env.LOGIN_USER, process.env.LOGIN_PASSWORD);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByTestId('title')).toHaveText('Products');
    await expect(page.getByRole('button', { name: 'Open Menu' })).toBeVisible();
  });

  test('usuario bloqueado', async ({ page }) => {
    // locked_out_user es un usuario publicado que no da acceso: es un dato de prueba, no un secreto.
    await loginPage.login('locked_out_user', process.env.LOGIN_PASSWORD);

    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    await expect(page).toHaveURL(/saucedemo\.com\/$/);
  });

  test('contraseña incorrecta', async () => {
    await loginPage.login(process.env.LOGIN_USER, 'incorrectPassword');

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
    await expect(loginPage.errorMessage).not.toContainText('locked out');
  });

  // Caso escrito antes que el código:
  // CP-SL-212 — Cerrar sesión
  //   Precondición: existe un usuario de prueba válido.
  //   Pasos: 1) Abrir el login. 2) Iniciar sesión. 3) Abrir el menú. 4) Clic en «Logout».
  //   Esperado: vuelves al login y el botón Login se ve.
  test('cerrar sesión', async ({ page }) => {
    await loginPage.login(process.env.LOGIN_USER, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/inventory\.html/);

    await page.getByRole('button', { name: 'Open Menu' }).click();
    // En Swag Labs «Logout» es un enlace con role="button".
    await page.getByRole('button', { name: 'Logout' }).click();

    await expect(page).toHaveURL(/saucedemo\.com\/$/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
