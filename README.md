# Proyecto final - Carlos Pingus
Proyecto final del Bootcamp Especialista en QA.

Contiene el análisis y los casos manuales de **Swag Labs** (Módulo 1, carpeta `docs/`) y una suite de pruebas
automatizadas con **Playwright** (Módulo 2) sobre los flujos de autenticación y carrito de
[Swag Labs](https://www.saucedemo.com/), más los tests de búsqueda en
[Toolshop](https://practicesoftwaretesting.com/) trabajados en las primeras sesiones.

## Requisitos
- [Node.js](https://nodejs.org/) 18 o superior
- [Git](https://git-scm.com/)

## Instalación
```bash
git clone https://github.com/Kazuto64/proyecto_final_Carlos_Pingus.git
cd proyecto_final_Carlos_Pingus
npm install
npx playwright install chromium
```
Copia `.env.example` como `.env` y completa la cuenta de prueba (`LOGIN_USER`, `LOGIN_PASSWORD`).
El archivo `.env` no se sube a Git.

## Ejecución
| Qué | Comando |
|---|---|
| Toda la suite | `npx playwright test --project=chromium` |
| Solo autenticación | `npx playwright test tests/auth --project=chromium` |
| Solo tienda | `npx playwright test tests/shop --project=chromium` |
| Solo búsqueda (Toolshop) | `npx playwright test tests/search --project=chromium` |
| Comprobar estabilidad | `npx playwright test --project=chromium --repeat-each=3` |
| Ver el reporte | `npm run report` |
| Experimentos de laboratorio | `npm run test:experiments -- --project=chromium` |

## Estructura
```
pages/              Page Objects: cómo es cada página (locators y acciones, sin expect)
tests/fixtures.js   Fixtures: lo que cada test recibe ya preparado (loginPage, credentials, loggedInPage…)
tests/auth/         Flujo de autenticación (Swag Labs)
tests/shop/         Flujo de la tienda hasta el carrito (Swag Labs)
tests/search/       Búsqueda en Toolshop (sesiones 10 y 11)
tests/experiments/  Experimentos de laboratorio que fallan a propósito; fuera de la suite
test-data/          Datos de prueba falsos para tests data-driven (las credenciales reales van en .env)
docs/               Documentación del Módulo 1 (plan, casos, matriz de trazabilidad, defectos)
.env.example        Variables necesarias, con valores de ejemplo
```

## Casos cubiertos
| ID | Descripción | Archivo |
|---|---|---|
| CP-SL-211 | Login exitoso lleva al catálogo de productos | `tests/auth/login.spec.js` |
| CP-SL-212 | Cerrar sesión vuelve al login | `tests/auth/login.spec.js` |
| CP-SL-201 | Usuario bloqueado muestra mensaje de bloqueo | `test-data/data-login.json` |
| CP-SL-202 | Contraseña incorrecta muestra error de credenciales | `test-data/data-login.json` |
| CP-SL-215 | Usuario vacío muestra que el usuario es obligatorio | `test-data/data-login.json` |
| CP-SL-213 | Agregar un producto lo muestra en el carrito con cantidad 1 (uno por cada producto de la lista) | `tests/shop/cart.spec.js` |
| CP-SL-214 | Agregar dos productos distintos muestra ambos con cantidad 1 | `tests/shop/cart.spec.js` |
| CP-BUSQ-01 a 05 | Portada, localizadores, búsqueda con y sin resultados, detalle de producto (Toolshop) | `tests/search/search.spec.js` |

Los casos CP-SL están trazados a sus requisitos en `docs/matriz-trazabilidad-v1.md`.

## Convenciones
| Elemento | Regla | Ejemplo |
|---|---|---|
| Test | Español, con ID y resultado | `CP-SL-201: usuario bloqueado muestra mensaje de bloqueo` |
| Archivo de test | Inglés, minúsculas, `.spec.js` | `cart.spec.js` |
| Clase y archivo | Inglés, PascalCase | `CartPage.js` |
| Método | Inglés, verbo + objeto, camelCase | `openProduct()` |
| Variable | Inglés, camelCase | `addToCartButton` |
| Constante | Inglés, MAYÚSCULAS | `PRODUCT_A` |

Los casos de login inválido salen de `test-data/data-login.json`: un caso nuevo es una fila nueva, con un `name` distinto.
Si falta una variable de `.env`, la suite se detiene con «Falta la variable X» (muestra el nombre, nunca el valor).

Sin esperas fijas (`waitForTimeout`) ni lecturas únicas (`expect(await …)`) en la suite; los `expect` viven en los tests.
