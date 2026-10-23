# Tabla de decisión v1 — Checkout paso 1 (SauceDemo)

**QA Automatizador · Semana 3 · Sesión 9**

| Dato | Detalle |
|---|---|
| **Autor** | Carlos Daniel Pingus Rodriguez |
| **Fecha de ejecución** | 21/10/2026, 20:39 – 20:41 |
| **Pantalla** | *Checkout: Your Information* (`/checkout-step-one.html`) |
| **Usuario y datos** | `standard_user`, 1 producto en el carrito (Sauce Labs Backpack). Datos: `Ana` / `Prueba` / `15102` |
| **Entorno** | Chromium (panel de navegador de Claude Desktop), escritorio, 800 px de ancho |
| **Requisito** | R4 de la matriz: nombre, apellido y código postal son obligatorios (ver `docs/matriz-trazabilidad-v1.md`) |
| **Archivo** | `docs/tabla-decision-v1.md` |

## 1. La regla

Al pulsar **Continue**, la aplicación revisa los tres campos del comprador. Si todos están llenos, avanza al resumen (*Checkout: Overview*). Si falta alguno, se queda en la pantalla y muestra **un solo** mensaje de error.

La regla se **infirió de la pantalla**, porque SauceDemo no publica requisitos: la aplicación muestra los mensajes «First Name is required», «Last Name is required» y «Postal Code is required». El orden en que revisa los campos se observó en la sesión exploratoria 1 (nota de las 19:10).

| Condición | Pregunta (sí / no) |
|---|---|
| C1 | ¿First Name tiene texto? |
| C2 | ¿Last Name tiene texto? |
| C3 | ¿Zip/Postal Code tiene texto? |

| Acción | Resultado |
|---|---|
| Avanzar | Abre `/checkout-step-two.html` sin error |
| Error FN | «Error: First Name is required» |
| Error LN | «Error: Last Name is required» |
| Error PC | «Error: Postal Code is required» |

## 2. Las 8 combinaciones

Con 3 condiciones hay 2 × 2 × 2 = **8 combinaciones**. Se ejecutaron todas para comprobar la regla, no solo las simplificadas.

| Combinación | C1 First Name | C2 Last Name | C3 Zip | Acción esperada | Resultado obtenido | Estado |
|---|---|---|---|---|---|---|
| K1 | Sí | Sí | Sí | Avanzar | Avanza a *Checkout: Overview* | Aprobado |
| K2 | Sí | Sí | No | Error PC | «Error: Postal Code is required» | Aprobado |
| K3 | Sí | No | Sí | Error LN | «Error: Last Name is required» | Aprobado |
| K4 | Sí | No | No | Error LN | «Error: Last Name is required» | Aprobado |
| K5 | No | Sí | Sí | Error FN | «Error: First Name is required» | Aprobado |
| K6 | No | Sí | No | Error FN | «Error: First Name is required» | Aprobado |
| K7 | No | No | Sí | Error FN | «Error: First Name is required» | Aprobado |
| K8 | No | No | No | Error FN | «Error: First Name is required» | Aprobado |

**Cómo se ejecutó:** los datos se escribieron con clics y teclado en la interfaz real, y se pulsó **Continue** con el mouse. Entre una combinación y otra, los campos se vaciaron desde la consola. Después de cada envío se leyeron la URL y el texto de `[data-test="error"]`.

## 3. Simplificación

K5 a K8 dan la misma acción (Error FN): cuando First Name está vacío, Last Name y Zip no cambian el resultado. K3 y K4 dan Error LN: cuando falta Last Name, Zip no importa. Las 8 combinaciones quedan en **4 reglas**.

| Condición | A | B | C | D |
|---|---|---|---|---|
| C1 First Name con texto | No | Sí | Sí | Sí |
| C2 Last Name con texto | — | No | Sí | Sí |
| C3 Zip con texto | — | — | No | Sí |
| **Acción** | **Error FN** | **Error LN** | **Error PC** | **Avanzar** |
| Combinaciones que une | K5 a K8 | K3 y K4 | K2 | K1 |

*El guion (—) significa «esta condición no cambia el resultado». Es un supuesto, así que se comprobó ejecutando las 8 combinaciones: la aplicación lo cumple en todas.*

## 4. Casos derivados

Un caso por regla simplificada, con datos concretos. Los cuatro se ejecutaron el 21/10/2026.

| ID | Regla | First Name | Last Name | Zip | Resultado esperado | Resultado obtenido | Estado | Evidencia |
|---|---|---|---|---|---|---|---|---|
| CP-SL-301 | A | *(vacío)* | `Prueba` | `15102` | Error FN; no avanza | «Error: First Name is required» | Aprobado | `evidencias/TD-R5-first-name-required.jpg` |
| CP-SL-302 | B | `Ana` | *(vacío)* | `15102` | Error LN; no avanza | «Error: Last Name is required» | Aprobado | — |
| CP-SL-303 | C | `Ana` | `Prueba` | *(vacío)* | Error PC; no avanza | «Error: Postal Code is required» | Aprobado | `evidencias/TD-R2-postal-code-required.jpg` |
| CP-SL-304 | D | `Ana` | `Prueba` | `15102` | Avanza al resumen | *Checkout: Overview*, Total $32.39 | Aprobado | `evidencias/TD-R1-avanza-overview.jpg` |

### Caso de borde: ¿qué cuenta como «tener texto»?

| ID | Regla | First Name | Last Name | Zip | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|---|---|---|
| CP-SL-305 | A | 3 espacios | `Prueba` | `15102` | Error FN: tres espacios no son un nombre | Avanza a *Checkout: Overview* sin error | **Fallido → DEF-02** |

La tabla supone que «tener texto» quiere decir tener al menos un carácter visible. La aplicación, en cambio, solo comprueba que el campo no esté vacío, así que un campo con espacios cuenta como lleno. Es el mismo defecto **DEF-02** de la sesión exploratoria 1, y también coincide con CP-SL-109, CP-SL-113 y CP-SL-114 de la Semana 2.

## 5. Qué muestra la tabla

- **La regla de obligatoriedad se cumple** en las 8 combinaciones con campos vacíos.
- **Solo se muestra un error a la vez.** En K8 (todo vacío) el mensaje nombra solo First Name, aunque faltan los tres. Esto confirma el hallazgo de usabilidad **U1** de la Semana 2: el usuario corrige un campo y recién al volver a enviar descubre el siguiente.
- **El problema está en qué cuenta como «lleno»** (CP-SL-305), no en las combinaciones.

## 6. Límites

- La tabla cubre solo si cada campo tiene o no tiene texto. El formato del código postal (RQ-CP-01) se probó con partición de equivalencia y valores límite en la Semana 2 (CP-SL-101 a 112).
- Se probó con `standard_user`. Con `error_user`, Last Name no acepta texto y Continue avanza igual (hallazgo S2-D4 de la sesión exploratoria 2), así que la regla B no se cumple para ese usuario.
