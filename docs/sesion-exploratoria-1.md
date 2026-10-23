# Sesión exploratoria 1 — SauceDemo (Swag Labs)

**Charter:** Explora el checkout (información del comprador → resumen) con datos extremos y recorridos alternativos (vacío, espacios, caracteres especiales, textos muy largos, volver atrás, recargar, URL directa) usando `standard_user` y `problem_user` para descubrir cómo valida los datos y cómo conserva el carrito.

| Campo | Valor |
|---|---|
| Producto | https://www.saucedemo.com (Swag Labs) |
| Fecha | 21/10/2026 |
| Inicio – Fin | 19:09 – 19:15 (time-box planificado: 25 min) |
| Tester | Carlos Pingus (ejecución asistida por Claude) |
| Entorno | Navegador Chromium (panel de navegador de Claude Desktop), escritorio 1024×768 y móvil 375×812 |

> Nota de honestidad: el time-box era de 25 min; la exploración real tomó 6 min porque varias pruebas de datos se ejecutaron en lote desde la consola. Las horas son las reales.

## Notas

Etiquetas: **O** observación · **D** defecto · **P** pregunta · **I** idea

| Hora | Tag | Nota (con valores concretos) |
|---|---|---|
| 19:09 | O | Al abrir `/inventory.html` el carrito ya tenía 1 ítem (Backpack). `localStorage.cart-contents = [4]` quedó de una visita anterior: el carrito persiste entre sesiones del navegador. |
| 19:09 | O | Login hecho con la cookie `session-username` (no por formulario). El login queda fuera de este charter. |
| 19:10 | O | Carrito: Backpack $29.99 + Bike Light $9.99 → Checkout lleva a `/checkout-step-one.html`. Ningún campo tiene `maxlength`. |
| 19:10 | O | Los 3 campos vacíos → "Error: First Name is required". Solo nombre → "Last Name is required". Nombre + apellido → "Postal Code is required". Apellido + zip sin nombre → "First Name is required". La validación va campo por campo, en orden. |
| 19:10 | **D** | Nombre = `"   "`, Apellido = `"   "`, Zip = `"   "` (solo espacios) → **pasa la validación** y llega a `/checkout-step-two.html`. → **DEF-02** |
| 19:10 | O | Resumen: Item total $39.98 · Tax $3.20 · Total $43.18. Revisé el impuesto: 8 % de 39.98 = 3.198 → $3.20 ✔. |
| 19:10 | P | El resumen no muestra el nombre ni el código postal ingresados. ¿Deben confirmarse antes de pagar? |
| 19:10 | O | Con el botón Atrás del navegador, desde step-two a step-one, los 3 campos vuelven **vacíos**: los datos no se conservan. |
| 19:10 | P | Zip = `ABCDE` y Zip = `-1` se aceptan. ¿Hay un formato esperado de código postal (solo números, longitud)? Sin especificación no lo marco como defecto. |
| 19:10 | O | Nombre = `<script>alert(1)</script>`, Apellido = `O'Brien; DROP TABLE`, Zip = `!@#$%` → se acepta y no se ejecuta ningún script. Los emojis (`😀😀`, `🙂`, `📦`) también se aceptan. |
| 19:10 | O | Nombre de 5000 "A", apellido de 5000 "B" y zip de 1000 "9" → se aceptan y no hay desborde horizontal (scrollWidth 793 < innerWidth 808). |
| 19:10 | **D** | Navegar directo a `/checkout-step-two.html` (y recargar) muestra el resumen con Finish habilitado, **sin pasar por el formulario** del comprador. → **DEF-05** |
| 19:10 | O | Al recargar en step-two el carrito se conserva (vive en localStorage). |
| 19:11 | **D** | Con el carrito vacío, el botón Checkout sigue habilitado; luego Continue y Finish → "Thank you for your order!" con **Total $0.00**. → **DEF-03** |
| 19:11 | D | Formato inconsistente en el resumen vacío: "Item total: $0" frente a "Tax: $0.00". Cosmético; anotado, aún sin reportar. |
| 19:11 | **D** | Con datos válidos (Ana / Prueba / 15102), al presionar **Enter** en el zip la app **vuelve al carrito** en lugar de continuar. Causa en el DOM: `#cancel` está dentro del `<form>` sin `type="button"` (es `submit`) y es el primer botón, así que Enter lo dispara. → **DEF-01** |
| 19:11 | I | La página final tiene un botón "Generate PDF order". Merece un charter propio. |
| 19:12 | **D** | `problem_user`: al escribir "Prueba" en Last Name, el texto **reemplaza el First Name** y Last Name queda vacío → "Error: Last Name is required". Este usuario no puede completar la compra. → **DEF-04** |
| 19:12 | O | `standard_user`: Cancel en step-two lleva a `/inventory.html` (no a step-one) y el carrito `[4,0]` se conserva. |
| 19:12 | P | ¿Cancel en el resumen debería volver al paso anterior o al catálogo? |
| 19:12 | O | Después de Finish, con Atrás vuelvo a step-two con $0.00 y Finish habilitado: se puede "finalizar" otra orden vacía (relacionado con DEF-03). |
| 19:12 | O | Accesibilidad: el error usa `role="alert"` ✔. Los inputs tienen `aria-label` pero no un `<label>` visible (solo placeholder) y no usan `aria-invalid`. |
| 19:12 | O | Móvil 375×812: el error "First Name is required" marca en rojo **los 3 campos** con ✖, aunque solo uno falla. |
| 19:12 | I | Explorar el checkout con `error_user` y `performance_glitch_user`. |
| 19:13 | O | Reproducción desde cero (localStorage limpio, UI real) de DEF-02, DEF-01 y DEF-03: los 3 se reproducen. Evidencias en `docs/evidencias/`. |

## Balance de tiempo

| Prueba | Reporte / reproducción | Entorno |
|---|---|---|
| ~4 min (65 %) | ~1.5 min (25 %) | ~0.5 min (10 %): reintentos porque el panel no renderizaba capturas |

## No alcancé a probar
- Checkout con `error_user`, `performance_glitch_user` y `visual_user`
- Dos pestañas a la vez (quitar ítems en una mientras la otra está en el resumen)
- Navegación solo con teclado (Tab/Shift+Tab) en todo el flujo
- El botón "Generate PDF order"
- Otros navegadores (Firefox, Safari)

## Resumen de hallazgos
5 defectos para reportar (DEF-01 a DEF-05) + 1 cosmético · 3 preguntas · 2 ideas. Detalle en `docs/reporte-defectos-v1.md`.
