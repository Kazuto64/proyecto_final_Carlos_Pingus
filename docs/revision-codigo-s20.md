# Revisión de mantenibilidad · Sesión 20

Revisión de la suite con el checklist de la S20, antes de agregar CP-SL-217.
Formato de cada hallazgo: **qué vi · por qué importa · qué sugiero · decisión**.
Regla aplicada: un cambio de mantenibilidad no cambia el comportamiento; se comprueba corriendo la suite.

| # | Archivo | Qué vi | Por qué importa | Qué sugiero | Decisión |
|---|---|---|---|---|---|
| 1 | `pages/HomePage.js` · `openProduct` | Busca el producto por nombre parcial (`hasText: name`) | Ambigüedad: un nombre contenido en otro coincide con dos productos y falla en modo estricto | Nombre exacto con `RegExp` `^…$`, escapando `.` y `( )` | Aplicado. `exact: true` no sirve aquí: el filtro es sobre el texto del título, no sobre un rol |
| 2 | `tests/auth/login.spec.js` | `toHaveURL(/saucedemo\.com\/$/)` en dos pruebas | Valor fijo: el dominio ya vive en `.env` (`BASE_URL`); cambiar de ambiente rompería estas pruebas | Comprobar «estamos en el login» con el botón Login | Aplicado |
| 3 | `tests/auth/login.spec.js` | `page.getByTestId('title')` y `Open Menu` escritos en la prueba | Repetición: los mismos locators ya existen en `HomePage` | Usar `HomePage` | Aplicado |
| 4 | `tests/fixtures.js` · `testWithSession` | `page.getByTestId('title')` repetido | Repetición | Usar `HomePage.title` | Aplicado |
| 5 | `tests/search/search.spec.js` | Todos los locators de Toolshop dentro de la prueba (`getByLabel('Search')` 3 veces) | Repetición; un cambio en la página obliga a editar varias pruebas | `pages/SearchPage.js`; términos en `test-data/search-data.json` | Aplicado. `search()` espera la respuesta de `/products/search` (S18) |
| 6 | `tests/shop/cart.spec.js` | Productos fijos en constantes del archivo | Valor fijo: cambiar un producto exige editar código | `test-data/cart-data.json` | Aplicado |
| 7 | `pages/HomePage.js` y `pages/PaymentPage.js` | La misma conversión de precio en dos clases | Repetición; con `replace('$', '')` «$1,000.00» daría NaN | Un solo `toNumber` en `pages/price.js`, con `/[^0-9.]/g` | Aplicado en la S18 |
| 8 | Toda la suite | ¿Esperas por tiempo? | Inestabilidad | `grep waitForTimeout` | Solo aparece en `tests/experiments/` (a propósito, con `test.skip`) |
| 9 | Toda la suite | ¿Secretos o datos reales? | Seguridad | Revisar `test-data/` y `.env.example` | Sin secretos: solo usuarios públicos de Swag Labs que no dan acceso y datos ficticios |

Con la suite ordenada, CP-SL-217 (varios productos) solo necesitó un dato nuevo (`products` en `checkout-data.json`),
una fixture (`checkoutAtBillingWithProducts`) y una prueba; las demás pruebas no cambiaron.
