# Proyecto final - Carlos Pingus

Proyecto final del Bootcamp Especialista en QA.

## Qué es

Suite de pruebas automatizadas con Playwright para [Swag Labs](https://www.saucedemo.com/): autenticación y dos flujos de negocio
(carrito y checkout), más el ordenamiento del catálogo. Incluye las pruebas de búsqueda en
[Toolshop](https://practicesoftwaretesting.com/) de las primeras sesiones. Los casos manuales del Módulo 1 están en `docs/`.

## Requisitos

| Herramienta                     | Versión usada                       |
| ------------------------------- | ----------------------------------- |
| [Node.js](https://nodejs.org/)  | 20 o superior (LTS)                 |
| [Git](https://git-scm.com/)     | cualquiera reciente                 |
| Playwright (`@playwright/test`) | 1.65 (se instala con `npm install`) |

## Instalación

```bash
git clone https://github.com/Kazuto64/proyecto_final_Carlos_Pingus.git
cd proyecto_final_Carlos_Pingus
npm install
npx playwright install chromium
```

## Configuración

Copia `.env.example` como `.env` y completa los valores. El `.env` no se sube a Git.

| Variable         | Qué es                            | Valor                                                   |
| ---------------- | --------------------------------- | ------------------------------------------------------- |
| `BASE_URL`       | Sitio bajo prueba                 | `https://www.saucedemo.com`                             |
| `SEARCH_URL`     | Sitio de las pruebas de búsqueda  | `https://practicesoftwaretesting.com`                   |
| `LOGIN_USER`     | Usuario de la cuenta de prueba    | El usuario estándar que publica la portada de Swag Labs |
| `LOGIN_PASSWORD` | Contraseña de la cuenta de prueba | La que publica la portada de Swag Labs                  |

Si falta una variable, la suite se detiene con «Falta la variable X» (muestra el nombre, nunca el valor).

## Ejecución

| Qué                                             | Comando                                                |
| ----------------------------------------------- | ------------------------------------------------------ |
| Toda la suite en Chromium                       | `npm run test:chromium`                                |
| Toda la suite en los 3 navegadores              | `npm test`                                             |
| Contar las pruebas sin ejecutarlas              | `npm run test:chromium -- --list`                      |
| Un solo flujo                                   | `npm run test:chromium -- tests/shop/checkout.spec.js` |
| Comprobar estabilidad                           | `npm run test:chromium -- --repeat-each=3`             |
| Abrir el reporte HTML                           | `npm run report` (Ctrl+C para cerrarlo)                |
| Experimentos de laboratorio (fuera de la suite) | `npm run test:experiments -- --project=chromium`       |

## Estructura

```
pages/              Page Objects: una pantalla, un archivo (locators y acciones)
  LoginPage · HomePage · ProductPage · CartPage   Login, catálogo, detalle y carrito de Swag Labs
  BillingPage · PaymentPage                       Checkout: «Your Information» y «Overview» + confirmación
  SearchPage                                      Portada y búsqueda de Toolshop
  price.js                                        Conversión de precios en texto a número (un solo lugar)
tests/fixtures.js   Fixtures: caminos repetidos (loggedInPage, checkoutAtBilling…) y sesión guardada (testWithSession)
tests/auth/         Autenticación
tests/shop/         Catálogo, carrito y checkout
tests/search/       Búsqueda en Toolshop
tests/experiments/  Experimentos de laboratorio que fallan a propósito; excluidos de la suite
test-data/          Datos de prueba ficticios en JSON (las credenciales reales van en .env)
docs/               Documentación del Módulo 1, matriz de trazabilidad y revisión de código (S20)
```

El checkout de Swag Labs no tiene login ni dirección propios: por eso no hay `CheckoutLoginPage` ni `CheckoutCartPage`
(el carrito ya es `CartPage`, que inicia el checkout con `startCheckout()`).

## Métricas iniciales (línea base)

Se miden con `npm run test:chromium`, sin `--repeat-each`. Una métrica sin fecha ni condiciones no sirve:
se compara siempre en las mismas condiciones.

| Métrica                           | Valor                       |
| --------------------------------- | --------------------------- |
| Fecha                             | 22/11/26                    |
| Navegador · Playwright · Node     | Chromium · 1.65.0 · v26.3.0 |
| Pruebas (suite, sin experimentos) | 19 en 5 archivos            |
| Pasaron                           | 19                          |
| Fallaron                          | 0                           |
| Flaky (pasaron en el reintento)   | 0                           |
| Tiempo total                      | 5.6 s                       |

Las métricas dicen cómo está la suite, no qué tan buena es: 19 de 19 en verde no dice si falta cubrir un flujo.

## Reporte y evidencia

- Cada corrida deja un reporte HTML en `playwright-report/` (se abre con `npm run report`) y un `results.json`. Ninguno se sube a Git.
- Evidencia automática solo cuando hace falta: captura si una prueba falla y traza en el primer reintento.
- CP-SL-001 y CP-SL-102 muestran sus pasos con nombre en el reporte y adjuntan capturas del resumen y de la confirmación.
- `retries: 1`: una prueba que pasa en el reintento aparece como **flaky**. Es una señal para corregir, no un verde.

## Pruebas inestables encontradas y su corrección

| Prueba                      | Síntoma                                             | Causa                                                                                                   | Corrección                                                                          |
| --------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| CP-BUSQ-03 y 04 (Toolshop)  | A veces mostraba todo el catálogo después de buscar | La lista inicial de la portada llegaba después de la búsqueda y la reemplazaba                          | Esperar la lista inicial antes de buscar                                            |
| CP-SL-213 y 214 (Swag Labs) | «strict mode violation»: 6 elementos                | Swag Labs cambia la URL antes de dibujar el detalle; `toHaveURL` pasaba con el catálogo aún en pantalla | Esperar algo que solo existe en la pantalla nueva («Back to products», «Your Cart») |

## Casos cubiertos

| ID                   | Descripción                                                                                     | Archivo                        |
| -------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------ |
| CP-SL-211            | Login exitoso lleva al catálogo de productos                                                    | `tests/auth/login.spec.js`     |
| CP-SL-212            | Cerrar sesión vuelve al login                                                                   | `tests/auth/login.spec.js`     |
| CP-SL-201            | Usuario bloqueado muestra mensaje de bloqueo                                                    | `test-data/data-login.json`    |
| CP-SL-202            | Contraseña incorrecta muestra error de credenciales                                             | `test-data/data-login.json`    |
| CP-SL-215            | Usuario vacío muestra que el usuario es obligatorio                                             | `test-data/data-login.json`    |
| CP-SL-213            | Agregar un producto lo muestra en el carrito con cantidad 1 (uno por cada producto de la lista) | `tests/shop/cart.spec.js`      |
| CP-SL-214            | Agregar dos productos distintos muestra ambos con cantidad 1                                    | `tests/shop/cart.spec.js`      |
| CP-SL-001, CP-SL-102 | Compra completa (data-driven): total = subtotal + 8 % y confirmación                            | `test-data/checkout-data.json` |
| CP-SL-103            | Sin código postal muestra el error; con él avanza al resumen                                    | `tests/shop/checkout.spec.js`  |
| CP-SL-217            | Compra con varios productos: subtotal = suma de precios                                         | `tests/shop/checkout.spec.js`  |
| CP-SL-216            | Compra completa con la sesión guardada (sin formulario de login)                                | `tests/shop/checkout.spec.js`  |
| CP-SL-203            | Ordenar por precio de menor a mayor                                                             | `tests/shop/catalog.spec.js`   |
| CP-BUSQ-01 a 05      | Portada, localizadores, búsqueda con y sin resultados, detalle de producto (Toolshop)           | `tests/search/search.spec.js`  |

Los casos CP-SL están trazados a sus requisitos en `docs/matriz-trazabilidad-v1.md`.

## Convenciones

| Elemento        | Regla                             | Ejemplo                                                   |
| --------------- | --------------------------------- | --------------------------------------------------------- |
| Test            | Español, con ID y resultado       | `CP-SL-201: usuario bloqueado muestra mensaje de bloqueo` |
| Archivo de test | Inglés, minúsculas, `.spec.js`    | `cart.spec.js`                                            |
| Clase y archivo | Inglés, PascalCase                | `CartPage.js`                                             |
| Método          | Inglés, verbo + objeto, camelCase | `openProduct()`                                           |
| Variable        | Inglés, camelCase                 | `addToCartButton`                                         |
| Constante       | Inglés, MAYÚSCULAS                | `PRODUCT_A`                                               |

Los casos de login inválido salen de `test-data/data-login.json`: un caso nuevo es una fila nueva, con un `name` distinto.
Si falta una variable de `.env`, la suite se detiene con «Falta la variable X» (muestra el nombre, nunca el valor).

Sin esperas fijas (`waitForTimeout`) ni lecturas únicas (`expect(await …)`) en la suite. Los `expect` viven en los tests;
la única excepción es `SearchPage.goto()`, que espera un estado para sincronizar (no verifica negocio).
