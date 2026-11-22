// Catálogo de Swag Labs: ordenamiento (R2 en docs/matriz-trazabilidad-v1.md).
// CP-SL-203 estaba «por ejecutar» en el Módulo 1: este test lo ejecuta.
import { test, expect } from '../fixtures.js';
import catalogData from '../../test-data/catalog-data.json';

test.describe('Catálogo', () => {
  test('CP-SL-203: ordenar por precio de menor a mayor muestra los precios en orden', async ({ homePage }) => {
    const { label, cheapest, mostExpensive } = catalogData.sortByPriceLowToHigh;

    await homePage.sortBy(label);

    // No hay un elemento que esperar: lo que se espera es un valor calculado (la lista ordenada).
    // expect.poll repite la pregunta «¿ya está ordenada?» hasta que sea verdad o venza el tiempo.
    // La función solo devuelve un valor; la aserción va fuera.
    await expect
      .poll(async () => {
        const prices = await homePage.prices();
        const sorted = [...prices].sort((a, b) => a - b);
        return prices.length > 1 && prices.join() === sorted.join();
      })
      .toBe(true);

    const prices = await homePage.prices();
    expect(prices[0]).toBe(cheapest);
    expect(prices.at(-1)).toBe(mostExpensive);
  });
});
