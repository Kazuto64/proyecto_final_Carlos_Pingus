// ⚠️ EXPERIMENTOS DE LABORATORIO — NO FORMAN PARTE DE LA SUITE
// Sesión 12 · Assertions, login con esperas y Trace Viewer
//
// Para ver uno: quita el .skip y ejecuta con traza
//   npm run test:experiments -- --project=chromium -g "<nombre>" --trace on
//   npx playwright show-report   (o show-trace con la ruta que imprime Playwright)
import { test, expect } from '@playwright/test';

// Parte 2: romper el login a propósito.
// Error esperado en el reporte: Expected "Epic sadface: Sorry…" · Received "Epic sadface: Username and password…"
// Prueba que las assertions del test real «contraseña incorrecta» sí pueden fallar.
test.skip('login roto: espera el mensaje de bloqueo con una contraseña incorrecta', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('incorrectPassword');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByTestId('error')).toHaveText('Epic sadface: Sorry, this user has been locked out.');
});

// Parte 3: lectura única vs. await expect.
// expect(await …isVisible()) lee una vez; si el error tarda, falla. Comparar con el test real, que usa await expect.
test.skip('lectura única del mensaje de error', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByLabel('Username').fill('locked_out_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  expect(await page.getByTestId('error').isVisible()).toBe(true);
});

// Parte 4 (Demo 4): una espera demasiado corta, y su traza.
// Ejecutar con --repeat-each=5 --trace on. En la traza: «Timeout 5000ms… element is not enabled».
// Arreglo: toBeEnabled({ timeout: 10000 }).
test.skip('espera corta', async ({ page }) => {
  await page.goto('http://uitestingplayground.com/disabledinput');
  await page.getByRole('button').click();
  await expect(page.getByRole('textbox')).toBeEnabled();
  await page.getByRole('textbox').fill('hola');
});
