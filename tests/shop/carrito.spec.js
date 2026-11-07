// Sesión 14 · Segundo flujo: llegar hasta el carrito (Swag Labs).
//
// CP-SL-213 — Agregar un producto al carrito
//   Precondición: sesión iniciada con la cuenta de prueba (fixture loggedInPage).
//   Pasos: 1) Abrir un producto. 2) Agregar al carrito. 3) Abrir el carrito.
//   Esperado: el producto aparece en el carrito con cantidad 1.
//
// CP-SL-214 — Agregar dos productos distintos
//   Pasos: 1) Agregar el producto A. 2) Volver al catálogo. 3) Agregar el producto B. 4) Abrir el carrito.
//   Esperado: ambos aparecen, cada uno con cantidad 1.
//
// Reconocimiento del sitio (tabla de locators):
// | Elemento          | Locator elegido                                         | Por qué                                         |
// |-------------------|---------------------------------------------------------|-------------------------------------------------|
// | Producto          | getByTestId('inventory-item-name').filter({ hasText })  | El rol con nombre se repite (imagen y título)   |
// | Título (detalle)  | getByTestId('inventory-item-name')                      | No es heading; no hay rol con nombre             |
// | Agregar           | getByRole('button', { name: 'Add to cart' })            | Rol con nombre visible                          |
// | Aviso             | getByTestId('shopping-cart-badge')                      | Swag Labs no muestra alert; el contador es la señal |
// | Enlace al carrito | getByTestId('shopping-cart-link')                       | Su nombre cambia con la cantidad («Cart, 1 items») |
// | Fila y cantidad   | getByTestId('inventory-item').filter() + 'item-quantity'| La cantidad es texto, no un spinbutton          |
import { test, expect } from "../fixtures.js";

const PRODUCTO = "Sauce Labs Backpack";
const PRODUCTO_B = "Sauce Labs Bike Light";

test("agregar un producto al carrito", async ({
  homePage,
  productPage,
  cartPage,
}) => {
  await homePage.openProduct(PRODUCTO);
  // Swag Labs cambia la URL antes de dibujar el detalle: se espera algo que solo existe ahí.
  await expect(productPage.backButton).toBeVisible();
  await expect(productPage.title).toHaveText(PRODUCTO);

  await productPage.addToCart();
  await expect(productPage.cartBadge).toHaveText("1");

  await productPage.openCart();
  await expect(cartPage.title).toHaveText("Your Cart");
  await expect(cartPage.rowFor(PRODUCTO)).toBeVisible();
  await expect(cartPage.quantityOf(PRODUCTO)).toHaveText("1");
});

// Revisado con la lista de la S14: solo métodos que existen en las clases, productos en constantes,
// await expect sin esperas fijas y ningún expect dentro de las clases.
test("agregar dos productos distintos al carrito", async ({
  homePage,
  productPage,
  cartPage,
}) => {
  await homePage.openProduct(PRODUCTO);
  // Swag Labs cambia la URL antes de dibujar el detalle: se espera algo que solo existe ahí.
  await expect(productPage.backButton).toBeVisible();
  await productPage.addToCart();
  await expect(productPage.cartBadge).toHaveText("1");

  await homePage.goto();
  await homePage.openProduct(PRODUCTO_B);
  // Swag Labs cambia la URL antes de dibujar el detalle: se espera algo que solo existe ahí.
  await expect(productPage.backButton).toBeVisible();
  await productPage.addToCart();
  await expect(productPage.cartBadge).toHaveText("2");

  await productPage.openCart();
  await expect(cartPage.title).toHaveText("Your Cart");
  await expect(cartPage.quantityOf(PRODUCTO)).toHaveText("1");
  await expect(cartPage.quantityOf(PRODUCTO_B)).toHaveText("1");
});
