# Reporte de defectos v1 — SauceDemo (Swag Labs)

**QA Automatizador · Semana 3 · Sesión 9**

| Dato | Detalle |
|---|---|
| **Autor** | Carlos Daniel Pingus Rodriguez |
| **Fecha** | 21/10/2026 |
| **Sistema** | https://www.saucedemo.com (Swag Labs) |
| **Entorno** | Chromium (panel de navegador de Claude Desktop), escritorio. Contraseña de los usuarios de prueba: `secret_sauce` |
| **Datos base** | `standard_user` · Sauce Labs Backpack ($29.99 + $2.40 de impuesto = $32.39) · comprador `Ana` / `Prueba` / `15102` |
| **Origen** | Sesión exploratoria 1 (`docs/sesion-exploratoria-1.md`), reproducción desde cero y tabla de decisión (`docs/tabla-decision-v1.md`) |
| **Archivo** | `docs/reporte-defectos-v1.md` |

## 1. Resumen

| ID | Título | Severidad | Prioridad | Estado | Requisito |
|---|---|---|---|---|---|
| DEF-01 | Enter en *Your Information* ejecuta Cancel en lugar de Continue | Media | Alta | Nuevo (duplicado de DEF-SL-002 / Jira SL-18) | R8 |
| DEF-02 | First Name, Last Name y Zip aceptan solo espacios | Media | Media | Nuevo | R4 |
| DEF-03 | Se completa una orden con el carrito vacío (Total $0.00) | Alta | Alta | Nuevo | R3 |
| DEF-04 | `problem_user`: lo escrito en Last Name reemplaza First Name | Alta | Media | Nuevo | R4 |
| DEF-05 | Se llega al resumen por URL sin llenar los datos del comprador | Media | Media | Nuevo · captura por confirmar | R6 |

*La severidad (impacto) y la prioridad (urgencia) son propuestas del autor y cada una se justifica en el detalle. Los estados siguen el flujo de Jira: Nuevo → Abierto → Corregido → Cerrado.*

## 2. Detalle de los defectos

### DEF-01 · Enter en *Your Information* ejecuta Cancel en lugar de Continue

| Campo | Detalle |
|---|---|
| **Encontrado en** | Sesión exploratoria 1, 21/10/2026 (19:11). Reproducido desde cero 2 de 2 veces. Caso relacionado: CP-SL-115. |
| **Precondiciones** | Sesión iniciada con `standard_user`; 1 producto en el carrito. |
| **Pasos para reproducir** | 1) Carrito → **Checkout**. 2) Escribir `Ana`, `Prueba` y `15102`. 3) Con el cursor en Zip/Postal Code, presionar **Enter**. |
| **Resultado esperado** | Enter envía el formulario igual que **Continue** y se abre *Checkout: Overview*. |
| **Resultado obtenido** | La aplicación vuelve a `/cart.html`, igual que con **Cancel**, y se pierde lo escrito. |
| **Causa observada** | `<button id="cancel">` está dentro del `<form>` sin `type="button"`, así que el navegador lo trata como botón de envío. Como es el primero del formulario, Enter lo activa. |
| **Evidencia** | `evidencias/D1-1-datos-validos.jpg`, `evidencias/D1-2-enter-vuelve-al-carrito.jpg` |
| **Severidad / prioridad** | **Media / Alta.** Se puede seguir pulsando Continue con el mouse, pero quien usa el teclado pierde sus datos y sale del checkout sin aviso. La corrección es de una línea. |
| **Requisito** | R8 (flujo operable con teclado). |
| **Nota** | Es el mismo defecto que DEF-SL-002 de la Semana 2, ya registrado en Jira como **SL-18**. Al pasarlo a Jira, se vincula como duplicado en lugar de crear otra incidencia. |

### DEF-02 · First Name, Last Name y Zip aceptan solo espacios

| Campo | Detalle |
|---|---|
| **Encontrado en** | Sesión exploratoria 1 (19:10), reproducido 2 de 2 veces. Confirmado otra vez con CP-SL-305 de la tabla de decisión, el 21/10/2026 a las 20:40. Casos relacionados: CP-SL-109, 113, 114 y 305. |
| **Precondiciones** | `standard_user`; 1 producto en el carrito. |
| **Pasos para reproducir** | 1) Carrito → **Checkout**. 2) Escribir tres espacios en First Name, `Prueba` en Last Name y `15102` en Zip. 3) Pulsar **Continue**. |
| **Resultado esperado** | «Error: First Name is required», igual que con el campo vacío. |
| **Resultado obtenido** | Pasa la validación y se abre *Checkout: Overview*; Finish queda habilitado. Pasa lo mismo con los tres campos. |
| **Evidencia** | `evidencias/D2-1-campos-con-espacios.jpg`, `evidencias/D2-2-avanza-al-resumen.jpg` |
| **Severidad / prioridad** | **Media / Media.** Se puede generar una orden sin datos reales del comprador, pero hay que hacerlo a propósito. |
| **Requisito** | R4 (datos del comprador obligatorios). |
| **Nota** | En la Semana 2 quedó como observación OBS-01; ahora se reporta como defecto. |

### DEF-03 · Se completa una orden con el carrito vacío (Total $0.00)

| Campo | Detalle |
|---|---|
| **Encontrado en** | Sesión exploratoria 1 (19:11), reproducido 2 de 2 veces. Caso relacionado: CP-SL-205. Ya se había anotado como hallazgo preliminar H01 en el documento de alcance QA-ALC-001. |
| **Precondiciones** | `standard_user`; carrito vacío. |
| **Pasos para reproducir** | 1) Abrir el carrito vacío y pulsar **Checkout**. 2) Escribir `Ana` / `Prueba` / `15102` y pulsar **Continue**. 3) En el resumen (Item total $0, Tax $0.00, Total $0.00), pulsar **Finish**. |
| **Resultado esperado** | Checkout deshabilitado o un mensaje como «Tu carrito está vacío»; no se crea ninguna orden. |
| **Resultado obtenido** | «Thank you for your order! Your order has been dispatched…» con Total $0.00. Con Atrás se puede volver al resumen y «finalizar» otra orden vacía. |
| **Evidencia** | `evidencias/D3-1-resumen-carrito-vacio.jpg`, `evidencias/D3-2-orden-completada.jpg` |
| **Severidad / prioridad** | **Alta / Alta.** El sistema confirma una compra que no existe. En una tienda real serían órdenes basura para logística y confusión para el cliente. |
| **Requisito** | R3 (no se puede comprar con el carrito vacío). |

### DEF-04 · `problem_user`: lo escrito en Last Name reemplaza First Name

| Campo | Detalle |
|---|---|
| **Encontrado en** | Sesión exploratoria 1 (19:12), reproducido 1 de 1 vez. Caso relacionado: CP-SL-207. |
| **Precondiciones** | Sesión iniciada con `problem_user`; 1 producto en el carrito. |
| **Pasos para reproducir** | 1) Carrito → **Checkout**. 2) Escribir `Ana` en First Name. 3) Hacer clic en Last Name y escribir `Prueba`. 4) Escribir `15102` en Zip y pulsar **Continue**. |
| **Resultado esperado** | First Name = Ana, Last Name = Prueba; se avanza al resumen. |
| **Resultado obtenido** | First Name muestra `Prueba`, Last Name queda vacío y aparece «Error: Last Name is required». Este usuario no puede terminar la compra. |
| **Evidencia** | `evidencias/D4-problem-user-apellido.jpg` |
| **Severidad / prioridad** | **Alta / Media.** Bloquea la compra, pero es una falla que Sauce Labs pone a propósito en este usuario de prueba (riesgo 2 del plan v1). |
| **Requisito** | R4. |

### DEF-05 · Se llega al resumen por URL sin llenar los datos del comprador

| Campo | Detalle |
|---|---|
| **Encontrado en** | Sesión exploratoria 1 (19:10) y otra vez a las 19:16 (2 de 2). Caso relacionado: CP-SL-208. Parecido al hallazgo preliminar H02 de QA-ALC-001, que se observó con el carrito vacío. |
| **Precondiciones** | `standard_user`; productos en el carrito; sin pasar por *Your Information*. |
| **Pasos para reproducir** | 1) Desde *Products*, escribir en la barra de direcciones `https://www.saucedemo.com/checkout-step-two.html`. 2) Pulsar **Finish**. |
| **Resultado esperado** | Redirección a `/checkout-step-one.html`, porque faltan los datos del comprador. |
| **Resultado obtenido** | Se muestra el resumen (1 ítem, Total $32.39) y Finish completa la orden sin nombre ni código postal. |
| **Evidencia** | **Por confirmar:** falta la captura. Hay que tomarla al registrar el defecto en Jira. |
| **Severidad / prioridad** | **Media / Media.** Hace falta escribir la URL a mano, pero se salta la única validación de datos del flujo. |
| **Requisito** | R6 (el checkout respeta el orden de los pasos). |

## 3. Hallazgos adicionales

No forman parte de los 5 de la entrega, pero quedan registrados para que la matriz de trazabilidad los asocie a su requisito.

**De la Semana 2** (`docs/casos-manuales-v1.md`, ya registrados en Jira)

| ID | Título | Severidad / prioridad | Estado | Requisito |
|---|---|---|---|---|
| DEF-SL-001 | El código postal acepta formatos inválidos | Media / Media | Abierto (SL-17) · el requisito es un supuesto | R5 |
| A11Y-H1 | El ícono del carrito no se alcanza con el teclado | Alta / Alta | Abierto (SL-19) | R8 |
| A11Y-H2 | No se ve dónde está el foco del teclado | Media / Media | Abierto (SL-20) | R8 |
| A11Y-H3 | El borde de los campos tiene contraste de 1.17:1 | Baja / Baja | Abierto (SL-21) | R8 |

**De la sesión exploratoria 2 con `error_user`** (`docs/sesion-exploratoria-2.md`, 21/10/2026)

| ID | Título | Severidad / prioridad | Estado | Requisito |
|---|---|---|---|---|
| S2-D1 | 3 de 6 productos no se agregan al carrito y no aparece ningún mensaje | Alta / Baja | Nuevo | R3 |
| S2-D2 | El ordenamiento no cambia la lista y muestra «Sorting is broken!» | Media / Baja | Nuevo | R2 |
| S2-D3 | «Remove» en el catálogo no quita el producto (en el carrito sí funciona) | Media / Baja | Nuevo | R3 |
| S2-D4 | Last Name no acepta texto y Continue avanza sin apellido | Media / Baja | Nuevo | R4 |
| S2-D5 | Finish no completa la compra y no aparece ningún mensaje | Alta / Baja | Nuevo | R6 |

*Prioridad baja en todos los de `error_user`: son fallas que Sauce Labs pone a propósito en ese usuario de prueba. Se documentan porque muestran algo útil para las pruebas: cuando algo falla, la aplicación no avisa nada al usuario.*

## 4. Un hallazgo, dos versiones (DEF-03)

*El mismo defecto se comunica distinto según quién lo lee.*

| Para quién | Texto |
|---|---|
| **Equipo técnico** | **Título:** Se completa una orden con el carrito vacío (Total $0.00).<br>**Pasos:** 1) `standard_user` con el carrito vacío → **Checkout**. 2) `Ana` / `Prueba` / `15102` → **Continue**. 3) **Finish**.<br>**Esperado:** Checkout deshabilitado o el mensaje «carrito vacío»; no se crea ninguna orden.<br>**Obtenido:** «Thank you for your order!» con Total $0.00; con Atrás se repite.<br>**Entorno:** saucedemo.com, Chromium de escritorio, 21/10/2026. **Evidencia:** `D3-1`, `D3-2`. |
| **Quien decide** | La tienda deja «comprar» sin haber elegido ningún producto: el cliente recibe la confirmación de un pedido de $0.00 y el sistema lo registra como una venta. En una operación real, eso significa pedidos vacíos que alguien tiene que revisar y clientes confundidos. Pasa siempre y es fácil de reproducir. **Se recomienda** bloquear el botón de compra cuando el carrito está vacío y corregirlo antes de la próxima entrega. |

## 5. Mejora de un reporte con IA (Nivel 2)

> **Por completar por Carlos.** Esta sección tiene que contar **tu** uso real de la IA. Sugerencia: pega el reporte de DEF-05 en un chat nuevo con el prompt de abajo y anota qué pasó.

| Pregunta | Respuesta |
|---|---|
| **Qué pedí** | «Actúa como revisor de calidad. Aquí está mi reporte de defecto. Dime qué información falta para reproducirlo, qué frases son ambiguas y si el título describe el problema. No inventes datos; si algo falta, pregunta.» [Reporte adjuntado] |
| **Qué adopté** | Sugerencias de estructura para fácil entendimiento y reproducción del defecto |
| **Qué rechacé y por qué** | Segmentos con exceso de tecnicismos que se alejan del alcance del defecto |
| **Cómo verifiqué** | Repetí los pasos del reporte mejorado por la IA y comprobé que se obtiene la misma respuesta |
