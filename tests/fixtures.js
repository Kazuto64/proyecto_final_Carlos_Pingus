// Fixtures: lo que cada test pide por nombre en async ({ ... }) y recibe ya preparado.
// Antes de await use(...) se prepara; después vendría la limpieza.
// En los tests, test y expect se importan de este archivo, no de @playwright/test.
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { HomePage } from '../pages/HomePage.js';
import { ProductPage } from '../pages/ProductPage.js';
import { CartPage } from '../pages/CartPage.js';
import { BillingPage } from '../pages/BillingPage.js';
import { PaymentPage } from '../pages/PaymentPage.js';
import { SearchPage } from '../pages/SearchPage.js';
import checkoutData from '../test-data/checkout-data.json';

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

  billingPage: async ({ page }, use) => {
    await use(new BillingPage(page));
  },

  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },

  // Toolshop (tests/search): el archivo cambia baseURL a SEARCH_URL con test.use.
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },

  // El camino hasta «Checkout: Your Information», escrito una sola vez (ver goToBilling, abajo).
  checkoutAtBilling: async ({ homePage, productPage, cartPage, billingPage }, use) => {
    await goToBilling({ homePage, productPage, cartPage, billingPage }, [checkoutData.product]);
    await use(billingPage);
  },

  // El mismo camino con varios productos (S20). Las pruebas que usan checkoutAtBilling no cambian.
  checkoutAtBillingWithProducts: async ({ homePage, productPage, cartPage, billingPage }, use) => {
    await goToBilling({ homePage, productPage, cartPage, billingPage }, checkoutData.products);
    await use(billingPage);
  },

  // Fixture de worker: inicia sesión UNA vez por proceso y guarda la sesión en memoria
  // (cookie session-username + Local storage). No se escribe ningún archivo con secretos
  // y se genera en cada ejecución, así que nunca está vieja.
  shopStorageState: [
    async ({ browser }, use) => {
      const context = await browser.newContext({ baseURL: process.env.BASE_URL });
      const page = await context.newPage();
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(process.env.LOGIN_USER, process.env.LOGIN_PASSWORD);
      await page.waitForURL(/inventory\.html/);
      const state = await context.storageState();
      await context.close();
      await use(state);
    },
    { scope: 'worker' },
  ],
});

// Variante con sesión guardada: cada contexto nuevo recibe la sesión y loggedInPage ya no pasa por el formulario.
// Todo lo que cuelga de loggedInPage (homePage, checkoutAtBilling…) se reutiliza sin cambios.
// Se usa cuando el login NO es lo que se prueba; el formulario se prueba en tests/auth.
export const testWithSession = test.extend({
  storageState: async ({ shopStorageState }, use) => {
    await use(shopStorageState);
  },

  loggedInPage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await expect(homePage.title).toHaveText('Products');
    await use(page);
  },
});

// Agrega cada producto desde su detalle, abre el carrito y empieza el checkout.
// Cada espera es por algo que solo existe en la pantalla nueva (Swag Labs cambia la URL antes de dibujar).
async function goToBilling({ homePage, productPage, cartPage, billingPage }, products) {
  for (const [index, product] of products.entries()) {
    if (index > 0) {
      await homePage.goto();
    }
    await homePage.openProduct(product);
    await expect(productPage.backButton).toBeVisible();
    await productPage.addToCart();
    await expect(productPage.cartBadge).toHaveText(String(index + 1));
  }
  await productPage.openCart();
  await expect(cartPage.title).toHaveText('Your Cart');
  await cartPage.startCheckout();
  await expect(billingPage.title).toHaveText('Checkout: Your Information');
}

export { expect };
