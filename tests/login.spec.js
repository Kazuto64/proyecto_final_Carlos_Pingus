// Sesión 12 · Assertions y login: que tu test compruebe de verdad
// Sitio: Swag Labs (https://www.saucedemo.com/) — mismo sistema de los casos del Módulo 1.
// Casos: CP-SL-211 (nuevo), CP-SL-201 y CP-SL-202 (docs/matriz-trazabilidad-v1.md, R1).
//
// Esperas en este archivo:
//   implícita → fill() y click() esperan a que el campo o el botón sean accionables.
//   explícita → cada await expect(...) reintenta hasta 5 s.
//   fija      → ninguna (sin waitForTimeout).
import { test, expect } from '@playwright/test';

test('login exitoso', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // 1. La navegación ocurrió: llegamos al catálogo.
  await expect(page).toHaveURL(/inventory\.html/);
  // 2. Se ve el título del catálogo.
  await expect(page.getByTestId('title')).toHaveText('Products');
  // 3. Aparece el menú de la sesión (donde está «Logout»).
  await expect(page.getByRole('button', { name: 'Open Menu' })).toBeVisible();
});

test('usuario bloqueado', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByLabel('Username').fill('locked_out_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // 1. Se ve el aviso correcto.
  await expect(page.getByTestId('error')).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  // 2. Seguimos en el login: el mensaje solo tiene sentido si no entró.
  await expect(page).toHaveURL(/saucedemo\.com\/$/);
});

test('contraseña incorrecta', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('incorrectPassword');
  await page.getByRole('button', { name: 'Login' }).click();

  // 1. Se ve el aviso de credenciales.
  await expect(page.getByTestId('error')).toHaveText(
    'Epic sadface: Username and password do not match any user in this service'
  );
  // 2. No es el aviso de usuario bloqueado (el .not va después de expect, antes de la assertion).
  await expect(page.getByTestId('error')).not.toContainText('locked out');
});
