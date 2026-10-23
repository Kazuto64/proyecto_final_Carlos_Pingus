# Plan de pruebas v1 — SauceDemo (Swag Labs)

**QA Automatizador · Semana 3**

## 1. Identificación

| Campo | Valor |
|---|---|
| Proyecto | Proyecto del curso QA Automatizador — análisis de SauceDemo |
| Sistema bajo prueba | https://www.saucedemo.com (Swag Labs), demo pública de e-commerce de Sauce Labs |
| Autor | Carlos Daniel Pingus Rodriguez |
| Versión y fecha | v1 — 21/10/2026 (actualizado el mismo día con la sesión 9) |
| Archivo | `docs/plan-de-pruebas-v1.md` |
| Estado | Borrador para revisión mediante pull request |

## 2. Objetivo y alcance

**Objetivo:** comprobar que un usuario puede iniciar sesión, elegir productos, gestionar su carrito y completar una compra con datos válidos, y que el sistema rechaza datos y recorridos inválidos en el checkout.

**Dentro del alcance**

| # | Elemento | Motivo |
|---|---|---|
| 1 | Login con los 6 usuarios publicados (standard, locked_out, problem, performance_glitch, error, visual) | Es la puerta de entrada; cada usuario simula una falla distinta. |
| 2 | Catálogo: listado, detalle y ordenamiento (A-Z, Z-A, precio ↑, precio ↓) | Es lo que el usuario usa para decidir qué comprar. |
| 3 | Carrito: agregar, quitar, contador y persistencia | La sesión 1 mostró que el carrito persiste en localStorage y permite checkout vacío (DEF-03). |
| 4 | Checkout: datos del comprador, resumen, cálculo de impuesto (8 %) y confirmación | Flujo de mayor riesgo; concentra los 5 defectos de la sesión 1. |
| 5 | Menú lateral: All Items, About, Logout, Reset App State | Afecta el estado de la sesión y del carrito. |
| 6 | Accesibilidad básica del checkout (teclado, etiquetas, mensajes de error) | DEF-01 muestra que el flujo con teclado falla. |

**Fuera del alcance**

| # | Elemento | Motivo |
|---|---|---|
| 1 | Rendimiento y carga | Es un sitio demo público; no tenemos permiso ni entorno para generar carga. |
| 2 | Seguridad (pentesting, inyección real) | Fuera del módulo 1 y sin autorización. Solo se anota lo observado en exploración. |
| 3 | Pasarela de pago real | No existe: el pago es fijo ("SauceCard #31337"). |
| 4 | Backend y API | La app es estática (front-end + localStorage); no hay API que probar. |
| 5 | Links externos (X, Facebook, LinkedIn, saucelabs.com) | No son parte del sistema. Solo se verifica que el link apunte al destino correcto. |

## 3. Enfoque

| Tipo de prueba | Cómo | Herramientas |
|---|---|---|
| Casos escritos (funcionales) | Partición de equivalencia y valores límite (sesión 5) sobre login y checkout; prioridad Alta, Media o Baja (`docs/casos-manuales-v1.md`). | Hoja de casos / Jira |
| Tablas de decisión | Cuando una regla combina varias condiciones, se prueban todas las combinaciones y se derivan casos de las reglas simplificadas (`docs/tabla-decision-v1.md`). | Plantilla de tabla en `docs/` |
| Trazabilidad | Cada requisito inferido se conecta con sus casos y defectos para detectar huecos (`docs/matriz-trazabilidad-v1.md`). | Matriz en `docs/` |
| **Testing exploratorio** | Sesiones con charter de 60 a 90 min, notas etiquetadas D/P/I/O y balance de tiempo. Heurísticas: datos extremos y recorridos alternativos. | Plantilla de notas en `docs/` y cronómetro |
| Accesibilidad básica | Recorrido completo solo con teclado; revisión de etiquetas, `aria-*`, foco y contraste en checkout. | DevTools, Lighthouse, axe DevTools |
| Responsive | Checkout y carrito a 375×812 (móvil) y 1024×768 (escritorio). | Emulación de dispositivos de DevTools |
| Regresión de defectos | Volver a probar cada defecto corregido o cerrado antes de pasarlo a "Cerrado". | Jira |
| Automatización (siguiente módulo) | Candidatos: login, compra feliz y validaciones del checkout. | Por definir en el módulo de automatización |

**Sesiones exploratorias planificadas**

| # | Charter | Estado |
|---|---|---|
| 1 | Checkout con datos extremos y recorridos alternativos (standard/problem_user) | Hecha (21/10) |
| 2 | Catálogo, carrito y checkout con `error_user` | Hecha (21/10) |
| 2b | Checkout y carrito con `performance_glitch_user` y `visual_user` | Pendiente |
| 3 | Flujo completo solo con teclado, para descubrir barreras de accesibilidad | Pendiente |
| 4 | Carrito en dos pestañas y "Reset App State" para descubrir inconsistencias de estado | Pendiente |

## 4. Criterios de entrada y salida

**Entrada** (todos deben cumplirse)
- [ ] https://www.saucedemo.com responde (HTTP 200) y la pantalla de login carga.
- [ ] Las 6 cuentas publicadas y la contraseña `secret_sauce` funcionan como indica la página.
- [ ] Este plan v1 está aprobado (pull request fusionado en `main`).
- [ ] Existe el proyecto en Jira para registrar defectos.

**Salida** (todos deben cumplirse)
- [ ] El 100 % de los casos de prioridad Alta se ejecutaron y su resultado está registrado.
- [ ] 0 defectos de severidad Alta en estado "Abierto" sin decisión (corregir, aceptar o diferir) documentada en Jira.
- [ ] Las sesiones exploratorias de la tabla están hechas y sus notas están en `docs/`.
- [ ] La matriz de trazabilidad no tiene requisitos sin casos ni casos de prioridad Alta sin ejecutar.
- [ ] Se entregó el reporte de al menos 5 defectos de la Semana 3.

## 5. Entorno y datos

| Elemento | Valor |
|---|---|
| URL | https://www.saucedemo.com |
| Navegadores | Chrome (versión estable actual): confirmado. Firefox y Edge: *por completar*. |
| Resoluciones | 1024×768 (escritorio) y 375×812 (móvil) |
| Usuarios | standard_user, locked_out_user, problem_user, performance_glitch_user, error_user, visual_user — contraseña `secret_sauce` |
| Datos de checkout | Válidos: `Ana` / `Prueba` / `15102`. Extremos: vacío, solo espacios, especiales, emojis, 5000 caracteres. |
| Estado inicial | localStorage limpio (o "Reset App State") antes de cada caso |

## 6. Roles y cronograma

| Rol | Responsable |
|---|---|
| Tester / autor del plan | Carlos Pingus |
| Revisor del pull request | *Por completar (docente o compañero asignado)* |

| Actividad | Fecha |
|---|---|
| Sesión exploratoria 1 + plan v1 | 21/10/2026 ✔ |
| Sesión exploratoria 2, tabla de decisión, matriz y reporte de defectos | 21/10/2026 ✔ |
| Sesiones exploratorias 2b a 4 | *Por completar* |
| Ejecución de casos de prioridad Alta | *Por completar* |

## 7. Riesgos

| # | Riesgo | Probabilidad / impacto | Mitigación |
|---|---|---|---|
| 1 | Sauce Labs cambia el sitio sin aviso (por ejemplo, apareció "Generate PDF order"). | Media / Media | Anotar la fecha de cada ejecución; volver a verificar los defectos antes de entregar; versionar las capturas. |
| 2 | Algunos defectos son intencionales del sitio demo (problem_user, error_user). | Alta / Baja | Reportarlos igual, marcando "falla propia del usuario de prueba", y darle prioridad a los defectos de `standard_user`. |
| 3 | El estado en localStorage contamina las pruebas (carrito heredado de otra visita). | Alta / Media | Limpiar localStorage o usar "Reset App State" al iniciar cada caso o sesión; anotarlo como precondición. |
| 4 | No hay requisitos formales; el "resultado esperado" se basa en el sentido común. | Alta / Media | Registrar las dudas como preguntas (P) y validarlas con el docente; marcar en Jira "esperado según heurística". |
| 5 | El sitio está caído o lento durante la entrega. | Baja / Alta | Guardar evidencias (capturas y notas) en cuanto se obtienen; tener una ventana de ejecución alternativa. |

## 8. Entregables

| Entregable | Ubicación | Estado |
|---|---|---|
| Plan de pruebas v1 | `docs/plan-de-pruebas-v1.md` | Hecho |
| Notas de la sesión exploratoria 1 | `docs/sesion-exploratoria-1.md` | Hecho |
| Notas de la sesión exploratoria 2 | `docs/sesion-exploratoria-2.md` | Hecho |
| Reporte de defectos v1 (DEF-01 a DEF-05 + adicionales, hallazgo en dos versiones) | `docs/reporte-defectos-v1.md` y Jira | Hecho en docs  |
| Tabla de decisión v1 | `docs/tabla-decision-v1.md` | Hecho |
| Evidencias (capturas) | `docs/evidencias/` | Hecho  |
| Matriz de trazabilidad v1 | `docs/matriz-trazabilidad-v1.md` | Hecho |
| Reporte final de pruebas | `docs/` | Hecho |