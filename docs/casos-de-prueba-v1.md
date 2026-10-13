# Casos de prueba manuales v1 — Swag Labs

**QA Automatizador · Sesión 6 · Entregable de la Semana 2**
Proyecto: Swag Labs (https://www.saucedemo.com/)

| Dato | Detalle |
|---|---|
| **Autor** | Carlos Daniel Pingus Rodriguez |
| **Pruebas funcionales** | 07-oct-2026 (CP-SL-001) y 09-oct-2026 (CP-SL-101 a 115) |
| **Pruebas de accesibilidad** | 12-oct-2026 · Lighthouse en Chrome (ventana de incógnito, modo *Resumen*, escritorio) + revisión manual en Chromium de escritorio |
| **Usuario de prueba** | `standard_user` |
| **Documentos base** | QA-ALC-001 (alcance) · `mapa-flujos-criticos.md` (sesión 4) · casos y defectos del código postal (sesión 5) |
| **Archivo** | `docs/casos-manuales-v1.md` |

---

## 1. Alcance y flujos críticos

**Sistema bajo prueba:** tienda de práctica Swag Labs. Es una SPA estática: login, carrito y compra se resuelven en el navegador, sin API (ver `mapa-flujos-criticos.md`).
**En alcance de esta versión:** el flujo de compra y el formulario *Checkout: Your Information*.
**Fuera de alcance:** rendimiento, seguridad, perfiles distintos de `standard_user` (se cubren en M07) y navegadores móviles.

**Requisito de referencia (supuesto):** Swag Labs no publica especificación. Por eso se toma **RQ-CP-01**: el código postal es obligatorio y debe tener exactamente 5 dígitos numéricos (formato peruano, ej. `15001`). La parte «obligatorio» sí se observa en la app, que muestra *Postal Code is required*.
**Datos base de prueba:** First Name `QA`, Last Name `Prueba`, Zip `15001`, producto Sauce Labs Backpack ($29.99 + $2.40 de impuesto = $32.39).

**Mapa del flujo crítico de compra**

```
Login (M01) → Products (M02) → Cart (M04)
  → Checkout: Your Information (F2 · F3)
  → Checkout: Overview (M05) → Finish
  → «Thank you for your order!»
```

| ID | Flujo crítico | Por qué es crítico | Casos |
|---|---|---|---|
| F1 | Compra completa (login → carrito → Finish) | Es el objetivo del sistema: si falla, no se vende. | CP-SL-001 |
| F2 | Datos del comprador (nombre, apellido, código postal) | Con datos inválidos, el pedido queda con un envío inservible. | CP-SL-101, 102, 104–114 |
| F3 | Envío del formulario y mensajes de error | Define cómo se recupera el usuario cuando se equivoca. | CP-SL-103, 115 |

---

## 2. Casos de prueba por flujo

**Técnicas:** partición de equivalencia y valores límite sobre el campo Zip/Postal Code (1 clase válida, 7 inválidas; longitudes 0, 4, **5** y 6).
**Precondición común (F2 y F3):** sesión iniciada con `standard_user`, 1 producto en el carrito y estar en *Checkout: Your Information*.
**Pasos comunes:** 1) First Name `QA`. 2) Last Name `Prueba`. 3) Escribir el dato del caso en Zip/Postal Code. 4) Pulsar **Continue**, salvo que el caso diga otra cosa.
**Estados:** **Aprobado**, **Fallido**, **Parcial** y **Por ejecutar**.

| ID | Flujo | Pasos y datos | Resultado esperado | Resultado observado | Estado |
|---|---|---|---|---|---|
| CP-SL-001 | F1 | Carrito vacío. Login → *Add to cart* (Backpack) → Cart → Checkout → `QA` / `Prueba` / `15001` → Continue → verificar el total → Finish. | Total $32.39; «Thank you for your order!»; carrito vacío. | «Thank you for your order!»; se elimina `cart-contents`. | Aprobado |
| CP-SL-101 | F2 | Zip `15001` (CV1 · long. 5). | Avanza al paso 2. | Avanza a *Checkout: Overview*, sin error. | Aprobado |
| CP-SL-102 | F2 | Zip `00000` (CV1 · valor extremo). | Avanza al paso 2. | Avanza a *Checkout: Overview*, sin error. | Aprobado |
| CP-SL-103 | F3 | Zip vacío (CI1 · long. 0). | Error «Postal Code is required». | Se queda en el paso 1 y muestra *Error: Postal Code is required*. | Aprobado |
| CP-SL-104 | F2 | Zip `1500` (CI2 · long. 4). | Rechaza: formato inválido. | Avanza al paso 2 sin error. | Fallido |
| CP-SL-105 | F2 | Zip `150011` (CI3 · long. 6). | Rechaza: formato inválido. | Avanza al paso 2 sin error. | Fallido |
| CP-SL-106 | F2 | Zip `ABCDE` (CI4 · solo letras). | Rechaza: formato inválido. | Avanza al paso 2 sin error. ¹ | Fallido |
| CP-SL-107 | F2 | Zip `15A01` (CI5 · alfanumérico). | Rechaza: formato inválido. | Avanza al paso 2 sin error. | Fallido |
| CP-SL-108 | F2 | Zip `15-01` (CI6 · caracteres especiales). | Rechaza: formato inválido. | Avanza al paso 2 sin error. | Fallido |
| CP-SL-109 | F2 | Zip con 5 espacios (CI7). | Error de campo obligatorio. | Avanza al paso 2 sin error. | Fallido |
| CP-SL-110 | F2 | Zip ` 15001 ` (espacio antes y después). | Recorta y avanza, o muestra un error claro. | Avanza al paso 2 sin error. ² | Aprobado |
| CP-SL-111 | F2 | Zip de 100 dígitos (CI3 · extremo). | Rechaza; la pantalla no se rompe. | Avanza al paso 2 sin error; sin desbordes. | Fallido |
| CP-SL-112 | F2 | Zip `150 01` (CI6 · espacio interno). | Rechaza: formato inválido. | Avanza al paso 2 sin error. | Fallido |
| CP-SL-113 | F2 | First Name con 5 espacios; Zip `15001`. | Error «First Name is required». | Avanza al paso 2 sin error. | Fallido |
| CP-SL-114 | F2 | Last Name con 5 espacios; Zip `15001`. | Error «Last Name is required». | Avanza al paso 2 sin error. | Fallido |
| CP-SL-115 | F3 | Zip vacío; clic en el campo y tecla **Enter**. | Error «Postal Code is required». | Vuelve a *Your Cart* sin mensaje y se pierden los datos. | Fallido |

¹ El primer intento terminó en el carrito, probablemente por haber enviado con Enter (ver DEF-SL-002). Se repitió pulsando *Continue*.
² No se puede verificar si la app recorta los espacios: el código postal no se muestra en el paso 2 ni se guarda en el navegador (OBS-02).

**Resumen:** 16 casos ejecutados · 5 aprobados · 11 fallidos. La app solo rechaza el campo **completamente vacío**; acepta cualquier otro contenido.

*Observación: la regla de 5 dígitos es un requisito supuesto. Antes de corregir DEF-SL-001 hay que confirmar con negocio el formato aceptado.*

**Cobertura de clases y límites**

| Clase / límite | Casos |
|---|---|
| CV1 · long. 5 | CP-SL-101, 102, 110 |
| CI1 · long. 0 | CP-SL-103, 115 |
| CI2 · long. 4 | CP-SL-104 |
| CI3 · long. 6 y 100 | CP-SL-105, 111 |
| CI4 | CP-SL-106 |
| CI5 | CP-SL-107 |
| CI6 | CP-SL-108, 112 |
| CI7 | CP-SL-109 (y 113, 114 en Nombre y Apellido) |

---

## 3. Defectos encontrados

La severidad (impacto) y la prioridad (urgencia) son propuestas del autor, cada una con su justificación.

### DEF-SL-001 · El código postal acepta formatos inválidos

| Campo | Detalle |
|---|---|
| **Casos relacionados** | CP-SL-104, 105, 106, 107, 108, 111, 112 |
| **Entorno** | saucedemo.com · Chromium de escritorio · `standard_user` · 09-oct-2026 |
| **Pasos para reproducir** | 1) Cart → Checkout. 2) Escribir `QA` y `Prueba`. 3) Escribir `ABCDE` en Zip/Postal Code. 4) Pulsar Continue. |
| **Esperado** | Mensaje de error de formato; no avanza (RQ-CP-01). |
| **Obtenido** | Avanza a *Checkout: Overview* sin error. Pasa lo mismo con `1500`, `150011`, `15A01`, `15-01`, `150 01` y un valor de 100 dígitos. El campo no tiene `maxlength` ni `pattern`. |
| **Severidad / prioridad** | **Media / Media.** No bloquea la compra, pero permite un pedido con datos de envío inservibles. Se reporta contra un requisito supuesto, así que primero hay que confirmarlo. |

### DEF-SL-002 · Presionar Enter en el formulario cancela el checkout

| Campo | Detalle |
|---|---|
| **Caso relacionado** | CP-SL-115 (y probablemente el primer intento de CP-SL-106) |
| **Entorno** | saucedemo.com · Chromium de escritorio · `standard_user` · 09-oct-2026 |
| **Pasos para reproducir** | 1) Cart → Checkout. 2) Escribir `QA` y `Prueba`. 3) Hacer clic en Zip/Postal Code. 4) Presionar **Enter**. |
| **Esperado** | Enter envía el formulario igual que *Continue* y valida los datos. |
| **Obtenido** | La app vuelve a *Your Cart* sin mensaje y se pierden los datos escritos. |
| **Causa observada** | *Cancel* (`#cancel`) es un botón `type="submit"` y está antes que *Continue*; el navegador activa el primer botón de envío. |
| **Severidad / prioridad** | **Media / Alta.** Hay alternativa (pulsar *Continue*), pero el usuario pierde lo que escribió. No depende de ningún supuesto y se corrige declarando *Cancel* como `type="button"`. |

### Observaciones (pendientes de reportar)

| ID | Observación | Casos | Recomendación |
|---|---|---|---|
| OBS-01 | Nombre, Apellido y Código postal aceptan entradas de **solo espacios**: se valida «no vacío», no «con contenido». | CP-SL-109, 113, 114 | Reportar como defecto en la siguiente entrega (Media / Alta). |
| OBS-02 | El código postal no se muestra en el paso 2 ni se guarda en el navegador. | CP-SL-110 | Tenerlo en cuenta al diseñar casos de datos de envío. |
| OBS-03 | Con los 3 campos vacíos, el error marca en rojo los 3 campos, pero el mensaje solo nombra uno. | CP-SL-103 | Ver U1 en la sección 4. |

---

## 4. Accesibilidad y usabilidad

**Flujo auditado:** F2/F3 · *Checkout: Your Information* (`/checkout-step-one.html`). Para H1 también se revisó *Products* (`/inventory.html`), porque el carrito es el paso previo al checkout.

**Cómo se midió**
- **Automático:** Lighthouse, categoría Accesibilidad, en Chrome de escritorio (incógnito), en **modo Resumen**. No se usó el modo Navegación porque recarga la página, borra el almacenamiento y cierra la sesión de Swag Labs. **Resultado: 26/26 comprobaciones aprobadas**, con 10 elementos para revisar a mano. Evidencia: `evidencias/a11y-lighthouse-checkout.png`.
- **Manual:** las 5 pruebas rápidas de la sesión 6, en Chromium de escritorio, el 12-oct-2026. El teclado se probó con Tab real y el registro del elemento con foco. El contraste se calculó con los colores reales de la página (fórmula de WCAG).

> Que Lighthouse no marque nada no quiere decir que la pantalla sea accesible. Las tres fallas de abajo se encontraron a mano.

**Resultado de las 5 pruebas rápidas**

| # | Prueba (WCAG) | Resultado | Detalle |
|---|---|---|---|
| 1 | Teclado y foco (2.1.1, 2.4.7) | ❌ Falla | El carrito no recibe el foco (H1). No se ve el foco (H2). No hay trampas de foco. |
| 2 | Contraste (1.4.3, 1.4.11) | ⚠️ Texto OK / borde falla | Texto: placeholder 4.64:1, título y botones 16.26:1, *Continue* 9.17:1, error 4.68:1. Borde de los campos: **1.17:1** (H3). |
| 3 | Texto alternativo (1.1.1) | ✅ Cumple | Ícono de menú con `alt="Open Menu"`; imágenes decorativas con `alt=""` o `aria-hidden="true"`. |
| 4 | Formularios (3.3.2) | ⚠️ Por confirmar | Sin `<label>` visible: solo placeholder (desaparece al escribir) y `aria-label`. El error se anuncia con `role="alert"`, pero los campos no usan `aria-invalid`. |
| 5 | Nombres de enlaces y botones (2.4.4, 4.1.2) | ✅ Cumple | Todos tienen nombre: «Open Menu», «Cart, 1 items», «Dismiss error», «Cancel», «Continue», X / Facebook / LinkedIn. |

### H1 · El ícono del carrito no se puede alcanzar con el teclado

| Campo | Detalle |
|---|---|
| **Principio y criterio** | Operable · 2.1.1 Teclado (nivel A) |
| **Pasos para reproducir** | 1) Iniciar sesión con `standard_user` y agregar un producto. 2) En *Products*, pulsar Tab desde el inicio de la página. 3) Repetir en *Checkout: Your Information*. |
| **Esperado** | El carrito recibe el foco con Tab y se abre con Enter. |
| **Obtenido** | En *Products*, el foco va de *Open Menu* al ordenamiento y luego a los productos. En el checkout va de *Open Menu* a *First Name*. **El carrito nunca recibe el foco.** Es un `<a role="button">` sin `href` ni `tabindex`, y el menú lateral no ofrece otra ruta al carrito. Evidencia: `evidencias/a11y-foco-inventario.jpg`. |
| **Afecta a** | Personas que navegan solo con teclado: personas con discapacidad motriz y usuarios de lector de pantalla. |
| **Severidad / prioridad** | **Alta / Alta.** Sin mouse no se puede llegar al carrito, así que **no se puede completar F1 (la compra)**. La corrección es pequeña: un `href` o `tabindex="0"` con manejo de Enter. |

### H2 · No se ve dónde está el foco del teclado

| Campo | Detalle |
|---|---|
| **Principio y criterio** | Operable · 2.4.7 Foco visible (nivel AA) |
| **Pasos para reproducir** | 1) Abrir *Checkout: Your Information*. 2) Recorrer con Tab: menú, 3 campos, Cancel, Continue y enlaces del pie. |
| **Esperado** | Un indicador visible (contorno o sombra) en el elemento que tiene el foco. |
| **Obtenido** | Todos los elementos tienen `outline-style: none` y no tienen `box-shadow`. En *Cancel*, *Continue* y los enlaces no se ve ningún cambio; en los campos solo aparece el cursor de texto. Se confirmó también en *Products*. |
| **Afecta a** | Personas que usan teclado: no saben qué botón activarán al pulsar Enter. Esto se suma al riesgo de DEF-SL-002. |
| **Severidad / prioridad** | **Media / Media.** Se puede usar, pero adivinando la posición del foco. |

### H3 · El borde de los campos casi no se ve (contraste 1.17:1)

| Campo | Detalle |
|---|---|
| **Principio y criterio** | Perceptible · 1.4.11 Contraste sin texto (nivel AA) |
| **Pasos para reproducir** | 1) Abrir *Checkout: Your Information*. 2) Inspeccionar (F12) el color de la línea inferior de un campo y el del fondo. 3) Medir la relación de contraste. |
| **Esperado** | Al menos 3:1 para el indicador visual que permite identificar el campo. |
| **Obtenido** | Línea `#EDEDED` sobre fondo `#FFFFFF`: **1.17:1**. Es el único borde del campo. |
| **Afecta a** | Personas con baja visión y cualquiera que use la pantalla con luz fuerte. |
| **Severidad / prioridad** | **Baja / Baja.** Mientras el campo está vacío, el placeholder (4.64:1) ayuda a ubicarlo. |

### U1 · El mensaje de error no dice todo lo que hay que corregir (usabilidad)

| Campo | Detalle |
|---|---|
| **Heurística de Nielsen** | Ayudar a reconocer, diagnosticar y recuperarse de los errores. |
| **Observado** | Con los 3 campos vacíos, los 3 se marcan en rojo, pero el mensaje dice solo «Error: First Name is required». El usuario corrige un campo, vuelve a enviar y recién ahí descubre el siguiente error. Evidencia: `evidencias/a11y-error-checkout.jpg`. |
| **Heurísticas relacionadas** | *Prevención de errores:* el código postal acepta cualquier formato (DEF-SL-001). *Control y libertad:* Enter cancela el checkout y borra lo escrito (DEF-SL-002). |

**Pendiente:** comprobar con un lector de pantalla (NVDA) cómo se anuncian los campos sin `<label>` visible y el error con `role="alert"`, para cerrar la prueba 4. Lo que no se confirmó queda «por confirmar» y no se presenta como un hecho.

---

## 5. Registro en la herramienta de gestión (Jira)

Los casos y defectos se registran en **Jira** con dos tipos de incidencia: **Caso de prueba** y **Defecto**. Estados de los casos: Por ejecutar → En ejecución → Aprobado o Fallido. Cada defecto se vincula con el caso que lo encontró. La carga se hizo importando `docs/jira-import.csv` (21 incidencias). Las etiquetas indican el flujo (`f1-compra`, `f2-datos-comprador`, `f3-envio-errores`), el estado y la severidad; los hallazgos llevan además `accesibilidad`.

**Proyecto:** *Swag Labs QA* (clave **SL**), plantilla Kanban, gestionado por el equipo. Columnas del tablero = estados: **Por ejecutar → En ejecución → Fallido / Aprobado**.
**Resultado de la importación (12-oct-2026):** 21 incidencias. Aprobado: 5 · Fallido: 11 · Por ejecutar: 5 (los defectos y hallazgos abiertos).

| Tipo | Clave | Resumen | Vínculo (relates to) |
|---|---|---|---|
| Caso de prueba | SL-1 | CP-SL-001 · Compra exitosa | f1-compra |
| Caso de prueba | SL-2 a SL-16 | CP-SL-101 a CP-SL-115 · Código postal (SL-2 = CP-SL-101 … SL-16 = CP-SL-115) | f2-datos-comprador / f3-envio-errores |
| Defecto | SL-17 | DEF-SL-001 · Código postal acepta formatos inválidos | SL-7 (CP-SL-106) |
| Defecto | SL-18 | DEF-SL-002 · Enter cancela el checkout | SL-16 (CP-SL-115) |
| Defecto | SL-19 | A11Y-H1 · Carrito inalcanzable con teclado | SL-1 (CP-SL-001) |
| Defecto | SL-20 | A11Y-H2 · Foco no visible | SL-2 (CP-SL-101) |
| Defecto | SL-21 | A11Y-H3 · Borde de campos 1.17:1 | SL-2 (CP-SL-101) |

**Captura del proyecto:**

![Proyecto Swag Labs en Jira](evidencias/jira-proyecto.png)

---

## 6. Uso de IA (Nivel 1)

| Pregunta | Respuesta |
|---|---|
| **Qué pedí** | “Explícame este hallazgo (H3) en palabras simples. ¿Qué exige el criterio del punto 1.4.11 y si este se aplica a un campo que solo tiene una línea inferior?” |
| **Qué usé de la respuesta** | Que el criterio se aplica cuando la línea es lo único que identifica el campo, y que entonces debe tener una relación de al menos 3:1. |
| **Qué verifiqué en la fuente** | Los textos de los criterios 2.1.1, 2.4.7, 1.4.11 y 3.3.2, en las páginas *Understanding WCAG 2.2* de w3.org. La relación 1.17:1 la recalculé con los colores reales de la página. |
| **Qué descarté y por qué** | No reporté como falla la prueba 4. La página de W3C sobre 3.3.2 no habla del placeholder, así que lo dejé «por confirmar» con un lector de pantalla. |
| **Transparencia** | La IA también me ayudó a ejecutar y entender paso por paso la revisión en el navegador y a armar el CSV de Jira para importar los casos de prueba directamente. Cada resultado se comprobó en la página antes de registrarlo en el documento. |
