# Swag Labs — Casos manuales y defectos · Campo «Código postal»

| Dato | Detalle |
|---|---|
| Proyecto | Especialización en QA · Swag Labs (saucedemo.com) |
| Módulo | Checkout — paso 1 *Your Information* (prioridad alta en QA-ALC-001) |
| Autor | Carlos Daniel Pingus Rodriguez |
| Fecha de ejecución | 09-oct-2026 |
| Entorno | saucedemo.com · navegador integrado de la app Claude (Chromium, escritorio) |
| Usuario de prueba | `standard_user` · 1 producto en el carrito (Item total $29.99) |
| Técnicas | Partición de equivalencia + análisis de valores límite |

---

## 1. Elige y analiza

### Campo elegido
**Zip/Postal Code** del formulario *Checkout: Your Information* (`#postal-code`).

Se eligió porque es el único dato del checkout con un formato natural (código postal) y porque, en una tienda real, un código postal inválido termina en envíos fallidos.

### Regla (requisito supuesto)
> **RQ-CP-01:** El código postal es **obligatorio** y debe tener **exactamente 5 dígitos numéricos** (formato peruano, ej. `15001`).

Swag Labs no publica especificación funcional, así que la regla se documenta como **supuesto** basado en el formato de código postal de Perú. La parte «obligatorio» sí es observable en la app: ella misma muestra el mensaje *Postal Code is required*.

### Lo que dice el HTML del campo (observado)
| Atributo | Valor | Implicancia |
|---|---|---|
| `type` | `text` | Acepta cualquier carácter |
| `maxlength` | sin límite | No restringe longitud |
| `pattern` | ninguno | No exige formato |
| `inputmode` | ninguno | No abre teclado numérico en móvil |
| `required` | no | La validación depende solo del JavaScript de la app |

### Clases de equivalencia
| ID | Clase | Tipo | Representante |
|---|---|---|---|
| CV1 | 5 dígitos numéricos | Válida | `15001`, `00000` |
| CI1 | Vacío | Inválida | *(vacío)* |
| CI2 | Menos de 5 dígitos | Inválida | `1500` |
| CI3 | Más de 5 dígitos | Inválida | `150011` |
| CI4 | Solo letras | Inválida | `ABCDE` |
| CI5 | Alfanumérico | Inválida | `15A01` |
| CI6 | Caracteres especiales | Inválida | `15-01` |
| CI7 | Solo espacios | Inválida | 5 espacios |

### Valores límite (longitud)
| Longitud | 0 | 4 | **5** | 6 |
|---|---|---|---|---|
| Esperado | Rechaza | Rechaza | **Acepta** | Rechaza |
| Caso | CP-SL-103 | CP-SL-104 | CP-SL-101 | CP-SL-105 |

---

## 2. Diseña y ejecuta

**Precondiciones comunes:** sesión iniciada con `standard_user`, 1 producto en el carrito, estar en *Checkout: Your Information*.
**Pasos comunes:** 1) Escribir First Name `QA`. 2) Escribir Last Name `Prueba`. 3) Escribir el valor del caso en Zip/Postal Code. 4) Pulsar **Continue**.
**Cómo se obtuvo el resultado:** tras cada envío se leyó la URL, el título de la página y el mensaje de error (`[data-test="error"]`); luego se volvió al formulario con «atrás» del navegador.

| ID | Entrada | Clase / límite | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|---|
| CP-SL-101 | `15001` | CV1 · long. 5 | Avanza al paso 2 | Avanza a *Checkout: Overview* (`/checkout-step-two.html`), sin error | ✅ Pasó |
| CP-SL-102 | `00000` | CV1 · valor extremo | Avanza al paso 2 | Avanza a *Checkout: Overview*, sin error | ✅ Pasó |
| CP-SL-103 | *(vacío)* | CI1 · long. 0 | Error «Postal Code is required» | Se queda en el paso 1 y muestra *Error: Postal Code is required* | ✅ Pasó |
| CP-SL-104 | `1500` | CI2 · long. 4 | Rechaza (formato inválido) | Avanza a *Checkout: Overview*, sin error | ❌ Falló |
| CP-SL-105 | `150011` | CI3 · long. 6 | Rechaza (formato inválido) | Avanza a *Checkout: Overview*, sin error | ❌ Falló |
| CP-SL-106 | `ABCDE` | CI4 | Rechaza (formato inválido) | Avanza a *Checkout: Overview*, sin error ¹ | ❌ Falló |
| CP-SL-107 | `15A01` | CI5 | Rechaza (formato inválido) | Avanza a *Checkout: Overview*, sin error | ❌ Falló |
| CP-SL-108 | `15-01` | CI6 | Rechaza (formato inválido) | Avanza a *Checkout: Overview*, sin error | ❌ Falló |
| CP-SL-109 | 5 espacios | CI7 | Error «requerido» | Avanza a *Checkout: Overview*, sin error | ❌ Falló |
| CP-SL-110 | ` 15001 ` (espacio antes y después) | CV1 con espacios | Recorta y avanza, o error claro | Avanza a *Checkout: Overview*, sin error ² | ✅ Pasó |

¹ El primer intento terminó en el carrito sin mostrar resultado; probablemente se envió con Enter (ver DEF-SL-002). Se repitió pulsando *Continue* y se registró el segundo intento.
² No se puede verificar si la app recorta los espacios: el código postal no aparece en el resumen del paso 2 ni se guarda en cookies ni en el almacenamiento del navegador (ver OBS-02).

**Resumen:** 10 ejecutados · 4 pasaron · 6 fallaron. La app solo rechaza el campo **completamente vacío**; acepta cualquier otro contenido.

---

## 3. Reporta y clasifica

### DEF-SL-001 — El código postal acepta formatos inválidos
| Campo | Detalle |
|---|---|
| Módulo | Checkout · paso 1 (*Your Information*) |
| Casos relacionados | CP-SL-104, 105, 106, 107, 108, 111, 112 |
| Entorno | saucedemo.com · Chromium escritorio · `standard_user` · 09-oct-2026 |
| Precondición | Sesión iniciada y 1 producto en el carrito |
| Pasos | 1. Ir a Cart → Checkout. 2. Escribir `QA` y `Prueba`. 3. Escribir `ABCDE` en Zip/Postal Code. 4. Pulsar Continue. |
| Resultado esperado | Mensaje de error de formato; no avanza (RQ-CP-01: 5 dígitos numéricos). |
| Resultado obtenido | Avanza a *Checkout: Overview* sin error. Lo mismo ocurre con `1500`, `150011`, `15A01`, `15-01`, `150 01` y un valor de 100 dígitos. |
| Evidencia | Registro de URL y título tras cada envío; el campo no tiene `maxlength` ni `pattern`. |
| **Severidad** | **Media** — no bloquea la compra ni rompe la app, pero permite completar un pedido con datos de envío inservibles. |
| **Prioridad** | **Media** — se reporta contra un requisito *supuesto*; antes de corregir hay que confirmar con negocio el formato aceptado (¿solo Perú?, ¿internacional?). |

### DEF-SL-002 — Presionar Enter en el formulario cancela el checkout
| Campo | Detalle |
|---|---|
| Módulo | Checkout · paso 1 (*Your Information*) |
| Casos relacionados | CP-SL-115 (y probablemente el primer intento de CP-SL-106) |
| Entorno | saucedemo.com · Chromium escritorio · `standard_user` · 09-oct-2026 |
| Precondición | Sesión iniciada y 1 producto en el carrito |
| Pasos | 1. Ir a Cart → Checkout. 2. Escribir `QA` y `Prueba`. 3. Hacer clic en Zip/Postal Code. 4. Presionar la tecla **Enter**. |
| Resultado esperado | Enter envía el formulario igual que *Continue*: valida los datos (aquí, error *Postal Code is required*). |
| Resultado obtenido | La app vuelve a *Your Cart* (`/cart.html`) sin mensaje y se pierden los datos escritos. |
| Causa observada | El botón *Cancel* (`#cancel`) está dentro del formulario como botón de envío (`type="submit"`) y aparece **antes** que *Continue*. Al presionar Enter, el navegador activa el primer botón de envío, que es *Cancel*. |
| Evidencia | Inspección del formulario: controles de envío en orden `#cancel` (submit) → `#continue` (submit). |
| **Severidad** | **Media** — no rompe la tienda y hay alternativa (pulsar *Continue* con el mouse o llegar a él con Tab), pero el usuario pierde lo que escribió y sale del checkout sin aviso. |
| **Prioridad** | **Alta** — no depende de ningún supuesto, Enter es una forma muy común de enviar formularios y la corrección es mínima (declarar *Cancel* como `type="button"`). |

> Ambos defectos tienen la misma severidad pero distinta prioridad: la severidad mide el impacto técnico; la prioridad, qué tan seguro y urgente es corregirlo.

### Observaciones (no reportadas como defecto por el límite de 2)
| ID | Observación | Casos | Recomendación |
|---|---|---|---|
| OBS-01 | Los 3 campos obligatorios (Nombre, Apellido, Código postal) aceptan entradas de **solo espacios**: la validación revisa «no vacío», no «con contenido». | CP-SL-109, 113, 114 | Reportar como defecto en la siguiente entrega (severidad Media, prioridad Alta). |
| OBS-02 | El código postal no se muestra en el resumen del paso 2 ni se guarda en el navegador; no se puede verificar qué valor usa la app. | CP-SL-110 | Tenerlo en cuenta al diseñar casos de datos de envío. |
| OBS-03 | El error de CP-SL-103 marca en rojo los 3 campos, aunque solo falta el código postal. | CP-SL-103 | Usabilidad menor; anotar para la revisión de interfaz. |

---

## 4. Valida con IA

La IA revisó la cobertura del documento y propuso 7 sugerencias. **La decisión de qué agregar fue del QA.**

| # | Sugerencia de la IA | Decisión | Motivo de la decisión |
|---|---|---|---|
| S1 | Probar un valor muy largo (100 dígitos) | ✅ Agregada → CP-SL-111 | El campo no tiene `maxlength`; vale la pena ver el extremo de CI3. |
| S2 | Probar espacios en medio (`150 01`) | ✅ Agregada → CP-SL-112 | Clase no cubierta: dígitos correctos con separador. |
| S3 | Repetir «solo espacios» en Nombre y Apellido | ✅ Agregada → CP-SL-113, 114 | Medir si el problema de CP-SL-109 afecta a todo el formulario. |
| S4 | Repetir casos con `problem_user` y `error_user` | ⏭️ Descartada aquí | Se cubre en M07, donde el alcance pide comparar perfiles. |
| S5 | Enviar el formulario con Enter | ✅ Agregada → CP-SL-115 | Otra vía de envío que podría validar distinto. |
| S6 | Registrar que el código postal no se muestra ni se guarda | ✅ Como observación → OBS-02 | No requiere ejecución nueva. |
| S7 | Registrar que el error marca los 3 campos | ✅ Como observación → OBS-03 | No requiere ejecución nueva. |

### Casos agregados y ejecutados
| ID | Origen | Nombre / Apellido | Código postal | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|---|---|
| CP-SL-111 | S1 | QA / Prueba | 100 dígitos | Rechaza; la pantalla no se rompe | Avanza al paso 2 sin error; sin desbordes ni scroll horizontal | ❌ Falló |
| CP-SL-112 | S2 | QA / Prueba | `150 01` | Rechaza (formato inválido) | Avanza al paso 2 sin error | ❌ Falló |
| CP-SL-113 | S3 | 5 espacios / Prueba | `15001` | Error «First Name is required» | Avanza al paso 2 sin error | ❌ Falló |
| CP-SL-114 | S3 | QA / 5 espacios | `15001` | Error «Last Name is required» | Avanza al paso 2 sin error | ❌ Falló |
| CP-SL-115 | S5 | QA / Prueba | *(vacío)* + Enter | Error «Postal Code is required» | Vuelve a *Your Cart* sin mensaje; datos perdidos | ❌ Falló |

**Lo que aportó la revisión:** amplió la evidencia de DEF-SL-001 (S1, S2), mostró que el problema de los espacios afecta a todo el formulario (OBS-01) y destapó un defecto nuevo de más prioridad (DEF-SL-002), que reemplazó al de los espacios dentro del límite de 2 defectos.

---

## Resumen final

| | Ejecutados | Pasaron | Fallaron |
|---|---|---|---|
| Diseño inicial (101–110) | 10 | 4 | 6 |
| Agregados por la revisión IA (111–115) | 5 | 0 | 5 |
| **Total** | **15** | **4** | **11** |

### Matriz de cobertura
| Clase / límite | Casos |
|---|---|
| CV1 | CP-SL-101, 102, 110 |
| CI1 · long. 0 | CP-SL-103, 115 |
| CI2 · long. 4 | CP-SL-104 |
| CI3 · long. 6 y extremo (100) | CP-SL-105, 111 |
| CI4 | CP-SL-106 |
| CI5 | CP-SL-107 |
| CI6 (símbolo y espacio interno) | CP-SL-108, 112 |
| CI7 | CP-SL-109 (y 113, 114 en Nombre/Apellido) |
