// Flujo de la tienda en Swag Labs: llegar hasta el carrito.
// Casos: CP-SL-213 y CP-SL-214 (R3 en docs/matriz-trazabilidad-v1.md).
//
// CP-SL-213 — Agregar un producto al carrito
//   Precondición: sesión iniciada con la cuenta de prueba (fixture loggedInPage, vía homePage).
//   Pasos: 1) Abrir un producto. 2) Agregar al carrito. 3) Abrir el carrito.
//   Esperado: el producto aparece en el carrito con cantidad 1.
//
// CP-SL-214 — Agregar dos productos distintos
//   Pasos: 1) Agregar el producto A. 2) Volver al catálogo. 3) Agregar el producto B. 4) Abrir el carrito.
//   Esperado: ambos aparecen, cada uno con cantidad 1.
//
// Reconocimiento del sitio (tabla de locators):
// | Elemento          | Locator elegido                                         | Por qué                                             |
// |-------------------|---------------------------------------------------------|-----------------------------------------------------|
// | Producto          | getByTestId('inventory-item-name').filter({ hasText })  | El rol con nombre se repite (imagen y título)       |
// | Título (detalle)  | getByTestId('inventory-item-name')                      | No es heading; no hay rol con nombre                |
// | Agregar           | getByRole('button', { name: 'Add to cart' })            | Rol con nombre visible                              |
// | Aviso             | getByTestId('shopping-cart-badge')                      | Swag Labs no muestra alert; el contador es la señal |
// | Enlace al carrito | getByTestId('shopping-cart-link')                       | Su nombre cambia con la cantidad («Cart, 1 items»)  |
// | Fila y cantidad   | getByTestId('inventory-item').filter() + 'item-quantity'| La cantidad es texto, no un spinbutton              |
import { test, expect } from '../fixtures.js';

const PRODUCT_A = 'Sauce Labs Backpack';
const PRODUCT_B = 'Sauce Labs Bike Light';

// Pocos datos que solo usa este archivo: un arreglo simple (un JSON sería más ceremonia que ayuda).
const PRODUCTS = [PRODUCT_A, PRODUCT_B];

test.describe('Carrito', () => {
  for (const product of PRODUCTS) {
    test(`CP-SL-213: agregar ${product} lo muestra en el carrito con cantidad 1`, async ({ homePage, productPage, cartPage }) => {
      await homePage.openProduct(product);
      // Swag Labs cambia la URL antes de dibujar el detalle: se espera algo que solo existe ahí.
      await expect(productPage.backButton).toBeVisible();
      await expect(productPage.title).toHaveText(product);

      await productPage.addToCart();
      await expect(productPage.cartBadge).toHaveText('1');

      await productPage.openCart();
      await expect(cartPage.title).toHaveText('Your Cart');
      await expect(cartPage.rowFor(product)).toBeVisible();
      await expect(cartPage.quantityOf(product)).toHaveText('1');
    });
  }

  test('CP-SL-214: agregar dos productos distintos muestra ambos con cantidad 1', async ({ homePage, productPage, cartPage }) => {
    await homePage.openProduct(PRODUCT_A);
    // Swag Labs cambia la URL antes de dibujar el detalle: se espera algo que solo existe ahí.
    await expect(productPage.backButton).toBeVisible();
    await productPage.addToCart();
    await expect(productPage.cartBadge).toHaveText('1');

    await homePage.goto();
    await homePage.openProduct(PRODUCT_B);
    // Swag Labs cambia la URL antes de dibujar el detalle: se espera algo que solo existe ahí.
    await expect(productPage.backButton).toBeVisible();
    await productPage.addToCart();
    await expect(productPage.cartBadge).toHaveText('2');

    await productPage.openCart();
    await expect(cartPage.title).toHaveText('Your Cart');
    await expect(cartPage.quantityOf(PRODUCT_A)).toHaveText('1');
    await expect(cartPage.quantityOf(PRODUCT_B)).toHaveText('1');
  });
});
