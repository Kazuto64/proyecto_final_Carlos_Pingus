# Sesión exploratoria 2 — SauceDemo (Swag Labs)

**Charter:** Explora el catálogo, el carrito y el checkout con `error_user` (ordenar, agregar y quitar productos, completar los datos del comprador y finalizar) para descubrir qué acciones fallan y si la aplicación avisa al usuario cuando algo no funciona.

| Campo | Valor |
|---|---|
| Producto | https://www.saucedemo.com (Swag Labs) |
| Fecha | 21/10/2026 |
| Inicio – Fin | 20:31 – 20:35 (time-box planificado: 15 min) |
| Tester | Carlos Pingus (ejecución asistida por Claude; Carlos inició sesión) |
| Entorno | Chromium (panel de navegador de Claude Desktop), ventana de 800 px de ancho |
| Estado inicial | Carrito vacío (`cart-contents` sin valor) |

> Nota de honestidad: la sesión duró 4 minutos, no 15. Los clics se hicieron en la interfaz real; el estado (carrito, URL, mensajes) se leyó desde la consola después de cada acción.

## Notas

Etiquetas: **O** observación · **D** defecto · **P** pregunta · **I** idea

| Hora | Tag | Nota (con valores concretos) |
|---|---|---|
| 20:31 | O | Login como `error_user` (lo hizo Carlos). Se ven los 6 productos y todos dicen «Add to cart». |
| 20:31 | **D** | Clic en «Add to cart» en los 6 productos: solo entran Backpack, Bike Light y Onesie (`cart-contents = [4,0,2]`, contador 3). **Bolt T-Shirt, Fleece Jacket y Test.allTheThings() T-Shirt (Red) no se agregan** y el botón sigue en «Add to cart». La pantalla no muestra ningún mensaje; la consola registra «Failed to add item to the cart». Se repitió el clic en Bolt T-Shirt: mismo resultado (2 de 2). → **S2-D1** |
| 20:32 | **D** | Ordenar por «Price (low to high)»: el orden no cambia ($29.99, $9.99, $15.99…) y la lista sigue en «Name (A to Z)». La página lanza el aviso «Sorting is broken! This error has been reported to Backtrace.» → **S2-D2** |
| 20:32 | P | El aviso es un `alert()` del navegador. ¿Un mensaje técnico así es aceptable para un cliente? |
| 20:32 | **D** | En el catálogo, «Remove» en Backpack no hace nada: sigue en el carrito y el contador queda en 3. Consola: «Failed to remove item from cart». → **S2-D3** |
| 20:33 | O | En la página del carrito, «Remove» sí quita el Backpack (`[0,2]`, contador 2). La falla es solo del botón del catálogo. |
| 20:33 | **D** | Checkout: con clic y teclado escribo `Ana` / `Prueba` / `15102`. **Last Name queda vacío**: no acepta lo escrito. → **S2-D4** |
| 20:34 | **D** | Con Last Name vacío, **Continue avanza** al Overview sin el error «Last Name is required» que sí aparece con `standard_user`. → **S2-D4** (misma falla, dos síntomas) |
| 20:34 | O | Overview: Bike Light $9.99 + Onesie $7.99 = Item total $17.98 · Tax $1.44 (8 % = 1.438 ✔) · Total $19.42. |
| 20:34 | **D** | Clic en **Finish** (2 veces): no pasa nada, la URL sigue en `/checkout-step-two.html` y el carrito no se vacía. Consola: «TypeError: wa.cesetRart is not a function». **No se puede completar la compra** y el usuario no recibe ningún mensaje. → **S2-D5** |
| 20:35 | O | «Reset App State» desde el menú vacía el carrito; Logout funciona. |
| 20:35 | I | Comparar con `performance_glitch_user` y `visual_user` en una sesión 3. |

## Balance de tiempo

| Prueba | Reporte / reproducción | Entorno |
|---|---|---|
| ~3 min (75 %) | ~0.5 min (12 %) | ~0.5 min (13 %): permiso del sitio para el navegador |

## No alcancé a probar
- Enter en el formulario con `error_user`
- Detalle del producto (`inventory-item.html`) con `error_user`
- `performance_glitch_user` y `visual_user`

## Resumen de hallazgos

| ID | Hallazgo | Reproducido | Evidencia |
|---|---|---|---|
| S2-D1 | 3 de 6 productos no se agregan al carrito, sin mensaje | 2 de 2 (Bolt T-Shirt) | `evidencias/S2-1-error-user-no-agrega-bolt.jpg` |
| S2-D2 | El ordenamiento falla y muestra «Sorting is broken!» | 1 de 1 | `evidencias/S2-2-error-user-orden-no-cambia.jpg` |
| S2-D3 | «Remove» del catálogo no quita el producto | 1 de 1 | — (consola) |
| S2-D4 | Last Name no acepta texto y Continue avanza sin apellido | 1 de 1 | `evidencias/S2-3-error-user-last-name-vacio.jpg`, `evidencias/S2-4-error-user-avanza-sin-apellido.jpg` |
| S2-D5 | Finish no completa la compra, sin mensaje | 2 de 2 | — (consola) |

Todas son fallas propias de `error_user`, un usuario de prueba que Sauce Labs configura para fallar (riesgo 2 del plan v1). Se registran como hallazgos adicionales en `docs/reporte-defectos-v1.md`.
