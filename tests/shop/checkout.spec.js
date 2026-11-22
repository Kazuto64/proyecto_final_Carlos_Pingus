// Flujo transaccional de Swag Labs: carrito → Your Information → Overview → Complete.
// Casos: CP-SL-001 y CP-SL-102 (data-driven), CP-SL-103 (validación intermedia), CP-SL-217 (varios productos)
// y CP-SL-216 (sesión guardada).
// Requisitos: R4, R5, R6 y R7 en docs/matriz-trazabilidad-v1.md.
//
// El camino hasta «Your Information» lo trae la fixture checkoutAtBilling; los datos, test-data/checkout-data.json.
// Swag Labs no tiene un backend de pedidos: repetir estas pruebas no crea pedidos reales.
import { test, testWithSession, expect } from '../fixtures.js';
import checkoutData from '../../test-data/checkout-data.json';

test.describe('Checkout', () => {
  // Data-driven: un test por compra del JSON. Un conjunto de datos nuevo = una fila nueva.
  for (const { id, name, buyer } of checkoutData.purchases) {
    // test.step agrupa las acciones con un nombre que se ve en el reporte HTML;
    // attach pega una captura en los dos momentos en que alguien preguntará «¿cómo se veía?».
    test(`${id}: ${name}`, async ({ page, checkoutAtBilling: billingPage, paymentPage }) => {
      await test.step('Completar los datos del comprador', async () => {
        await billingPage.fillBuyer(buyer);
        await billingPage.continueToOverview();
        await expect(paymentPage.title).toHaveText('Checkout: Overview');
      });

      await test.step('Verificar el total del resumen', async () => {
        // R7: total = subtotal + impuesto del 8 % (los montos se leen cuando el resumen ya está en pantalla).
        const { subtotal, tax, total } = await paymentPage.amounts();
        expect(tax).toBeCloseTo(subtotal * checkoutData.taxRate, 2);
        expect(total).toBeCloseTo(subtotal + tax, 2);
        await test.info().attach('resumen', { body: await page.screenshot(), contentType: 'image/png' });
      });

      await test.step('Confirmar el pedido', async () => {
        await paymentPage.confirmOrder();
        // Primero la aserción: la foto se toma cuando la confirmación ya está en pantalla.
        await expect(paymentPage.orderConfirmation).toBeVisible();
        // Al terminar, el carrito queda vacío: el contador desaparece.
        await expect(paymentPage.cartBadge).toBeHidden();
        await test.info().attach('confirmacion', { body: await page.screenshot(), contentType: 'image/png' });
      });
    });
  }

  // Validación intermedia: el par antes y después.
  // Sin código postal no avanza (antes); con el mismo formulario completo, sí (después).
  // Solo el «antes» no basta: un botón roto tampoco avanzaría.
  test('CP-SL-103: sin código postal muestra el error y con él avanza al resumen', async ({ checkoutAtBilling: billingPage, paymentPage }) => {
    const { buyer, postalCode, error } = checkoutData.missingPostalCode;

    await billingPage.fillBuyer(buyer);
    await billingPage.continueToOverview();
    await expect(billingPage.errorMessage).toHaveText(error);
    await expect(billingPage.title).toHaveText('Checkout: Your Information');

    await billingPage.postalCode.fill(postalCode);
    await billingPage.continueToOverview();
    await expect(paymentPage.title).toHaveText('Checkout: Overview');
  });

  // S20: el dato (lista de productos) y la fixture son nuevos; las demás pruebas no cambian.
  test('CP-SL-217: compra con varios productos suma sus precios en el resumen', async ({ checkoutAtBillingWithProducts: billingPage, paymentPage }) => {
    const [{ buyer }] = checkoutData.purchases;

    await billingPage.fillBuyer(buyer);
    await billingPage.continueToOverview();
    await expect(paymentPage.title).toHaveText('Checkout: Overview');
    await expect(paymentPage.itemNames).toHaveText(checkoutData.products);

    const prices = await paymentPage.prices();
    const { subtotal, tax, total } = await paymentPage.amounts();
    const sum = prices.reduce((acc, price) => acc + price, 0);
    expect(subtotal).toBeCloseTo(sum, 2);
    expect(tax).toBeCloseTo(subtotal * checkoutData.taxRate, 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);

    await paymentPage.confirmOrder();
    await expect(paymentPage.orderConfirmation).toBeVisible();
  });
});

// Sesión guardada: el login no es lo que se prueba aquí, así que la sesión llega hecha (storageState).
// En esta cadena loggedInPage abre directo el catálogo: si la sesión no llegara, Swag Labs
// redirigiría al login y la fixture fallaría en «Products», antes de empezar la compra.
testWithSession.describe('Checkout con sesión guardada', () => {
  testWithSession('CP-SL-216: compra completa sin pasar por el formulario de login', async ({ checkoutAtBilling: billingPage, paymentPage }) => {
    const [{ buyer }] = checkoutData.purchases;

    await billingPage.fillBuyer(buyer);
    await billingPage.continueToOverview();
    await expect(paymentPage.title).toHaveText('Checkout: Overview');

    await paymentPage.confirmOrder();
    await expect(paymentPage.orderConfirmation).toBeVisible();
  });
});
