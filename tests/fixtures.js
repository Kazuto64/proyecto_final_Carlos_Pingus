// Fixtures: lo que cada test pide por nombre en async ({ ... }) y recibe ya preparado.
// Antes de await use(...) se prepara; después vendría la limpieza.
// En los tests, test y expect se importan de este archivo, no de @playwright/test.
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { HomePage } from '../pages/HomePage.js';
import { ProductPage } from '../pages/ProductPage.js';
import { CartPage } from '../pages/CartPage.js';

export const test = base.extend({
  // El login abierto y listo para usar.
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  // Fixture de datos: la cuenta de prueba real, desde .env. El {} vacío: no pide nada.
  credentials: async ({}, use) => {
    await use({
      user: process.env.LOGIN_USER,
      password: process.env.LOGIN_PASSWORD,
    });
  },

  // Fixture encadenada: pide loginPage y credentials, y entrega la page con la sesión iniciada.
  // Si el login falla, el error señala esta preparación y el test no llega a correr.
  loggedInPage: async ({ page, loginPage, credentials }, use) => {
    await loginPage.login(credentials.user, credentials.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await use(page);
  },

  // En Swag Labs el catálogo exige sesión: homePage parte de loggedInPage.
  homePage: async ({ loggedInPage }, use) => {
    await use(new HomePage(loggedInPage));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

export { expect };
