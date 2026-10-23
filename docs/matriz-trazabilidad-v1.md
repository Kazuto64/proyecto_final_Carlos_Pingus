# Matriz de trazabilidad v1 — SauceDemo (Swag Labs)

**QA Automatizador · Semana 3 · Sesión 9**

> Conecta cada requisito con sus casos de prueba y con los defectos encontrados, y muestra los huecos de cobertura. SauceDemo no publica requisitos, así que se **infirieron de la pantalla** y del documento de alcance QA-ALC-001. RQ-CP-01 (formato del código postal) es un **supuesto** del autor.

| Dato | Detalle |
|---|---|
| **Autor** | Carlos Daniel Pingus Rodriguez |
| **Fecha** | 21/10/2026 |
| **Archivo** | `docs/matriz-trazabilidad-v1.md` |
| **Fuentes** | `casos-manuales-v1.md` (CP-SL-001, 101 a 115, defectos de la Semana 2) · `tabla-decision-v1.md` (CP-SL-301 a 305) · `reporte-defectos-v1.md` · sesiones exploratorias 1 y 2 |
| **Estados** | Aprobado · Fallido · Parcial (cumple una parte) · Por ejecutar (escrito, sin ejecutar) |

## 1. Matriz requisito → casos → defectos

| ID | Requisito (inferido) | Casos | Estado de ejecución | Defectos | Observación |
|---|---|---|---|---|---|
| R1 | Los usuarios publicados inician sesión; un usuario bloqueado o una contraseña incorrecta reciben un mensaje claro. | CP-SL-001, **CP-SL-201**, **CP-SL-202** | CP-SL-001 aprobado; 201 y 202 por ejecutar | — | Antes solo tenía el login feliz. Se crearon 201 y 202 para los casos negativos. |
| R2 | El catálogo se ordena según la opción elegida (A-Z, Z-A, precio ↑, precio ↓). | **CP-SL-203**, **CP-SL-204** | 203 por ejecutar; 204 fallido | S2-D2 | **Era un HUECO (sin casos).** Se crearon 2 casos; con `standard_user` falta ejecutar. |
| R3 | El carrito refleja lo que se agrega y se quita, y no permite comprar con el carrito vacío. | CP-SL-001, **CP-SL-205**, **CP-SL-206** | 001 aprobado; 205 y 206 fallidos | DEF-03, S2-D1, S2-D3 | Antes solo tenía CP-SL-001. El carrito vacío (205) es el defecto más grave del proyecto. |
| R4 | Nombre, apellido y código postal son obligatorios y deben tener contenido real. | CP-SL-103, 109, 113, 114, **207**, **301 a 305** | 103 y 301 a 304 aprobados; 109, 113, 114, 207 y 305 fallidos | DEF-02, DEF-04, S2-D4 | La regla de obligatoriedad se cumple (tabla de decisión: 8 de 8). Falla con espacios y con usuarios especiales. |
| R5 | El código postal tiene exactamente 5 dígitos numéricos (RQ-CP-01). | CP-SL-101, 102, 104 a 108, 110 a 112 | 101, 102 y 110 aprobados; 104 a 108, 111 y 112 fallidos | DEF-SL-001 | **Requisito supuesto:** hay que confirmar el formato antes de corregir. |
| R6 | El checkout respeta el orden de los pasos (datos → resumen → Finish) y Finish completa la orden. | CP-SL-001, **CP-SL-208**, **CP-SL-209** | 001 aprobado; 208 y 209 fallidos | DEF-05, S2-D5 | Antes solo tenía el flujo feliz. |
| R7 | El total del resumen es igual al subtotal más un impuesto del 8 %. | CP-SL-001 | Aprobado | — | Un solo caso; también se comprobó en las sesiones 1 y 2 ($43.18 y $19.42). La cobertura es débil. |
| R8 | La compra se puede hacer con el teclado y es perceptible (WCAG 2.1.1, 2.4.7 y 1.4.11). | CP-SL-115, **CP-SL-210** | 115 fallido; 210 parcial | DEF-01 (= DEF-SL-002), A11Y-H1, A11Y-H2, A11Y-H3 | CP-SL-210 resume la auditoría de accesibilidad de la Semana 2. Falta probar con lector de pantalla. |

*En **negrita**, los casos creados en esta sesión para cubrir huecos.*

## 2. Casos creados para cubrir huecos

Los casos 204 a 209 se escribieron a partir de defectos ya reproducidos en las sesiones exploratorias, así que su estado es el resultado de esa reproducción. Los casos 201 a 203 son nuevos y **todavía no se ejecutan**.

| ID | Req. | Pasos y datos | Resultado esperado | Estado | Origen |
|---|---|---|---|---|---|
| CP-SL-201 | R1 | Login con `locked_out_user` / `secret_sauce`. | No entra; muestra «Sorry, this user has been locked out.» | Por ejecutar | Hueco de R1 |
| CP-SL-202 | R1 | Login con `standard_user` y una contraseña incorrecta. | No entra; muestra un error de credenciales. | Por ejecutar | Hueco de R1 |
| CP-SL-203 | R2 | `standard_user` → ordenar por «Price (low to high)». | Precios de menor a mayor: $7.99 primero y $49.99 al final. | Por ejecutar | Hueco de R2 |
| CP-SL-204 | R2 | `error_user` → ordenar por «Price (low to high)». | Lista ordenada por precio. | Fallido (S2-D2) | Sesión 2, 20:32 |
| CP-SL-205 | R3 | `standard_user`, carrito vacío → Checkout → datos → Continue → Finish. | No se permite finalizar una orden sin productos. | Fallido (DEF-03) | Sesión 1, 19:11 |
| CP-SL-206 | R3 | `error_user` → «Add to cart» en los 6 productos y luego «Remove» en el catálogo. | Contador 6 y luego 5. | Fallido (S2-D1, S2-D3) | Sesión 2, 20:31 |
| CP-SL-207 | R4 | `problem_user` → Checkout → `Ana` / `Prueba` / `15102` → Continue. | Se conservan los datos y se avanza al resumen. | Fallido (DEF-04) | Sesión 1, 19:12 |
| CP-SL-208 | R6 | `standard_user` con producto en el carrito → abrir `/checkout-step-two.html` por URL. | Redirige al paso 1. | Fallido (DEF-05) | Sesión 1, 19:10 |
| CP-SL-209 | R6 | `error_user` → checkout completo → Finish. | «Thank you for your order!» | Fallido (S2-D5) | Sesión 2, 20:34 |
| CP-SL-210 | R8 | Las 5 pruebas rápidas de accesibilidad en *Checkout: Your Information* (teclado, contraste, texto alternativo, formularios, nombres). | Pasan las 5 pruebas. | Parcial (2 cumplen, 2 fallan, 1 por confirmar) | Auditoría de la Semana 2 |

## 3. Qué muestra la matriz

**Huecos de cobertura**

- **R2 (ordenamiento) era el hueco principal:** no tenía ningún caso. Ahora tiene dos, pero el de `standard_user` (CP-SL-203) aún no se ejecuta, así que no se sabe si el ordenamiento funciona para el usuario normal.
- **R1 solo tenía el login feliz.** Se crearon dos casos negativos (201 y 202) y están por ejecutar.
- **R7 tiene un solo caso.** La cobertura de presencia está bien, pero la de calidad es débil: falta un caso con varios productos y decimales que redondeen.
- **No hay casos sin requisito.** Los 31 casos (CP-SL-001, 101 a 115, 201 a 210 y 301 a 305) están asociados a un requisito.

**Impacto de los defectos**

- **R3 y R6 concentran los defectos de flujo:** se puede comprar con el carrito vacío (DEF-03) y saltarse los datos del comprador (DEF-05). Son los más importantes para quien decide.
- **R4 tiene la validación más débil:** la regla de campos obligatorios se cumple, pero un campo con solo espacios cuenta como lleno (DEF-02).
- **R8 acumula 4 hallazgos de accesibilidad.** Juntos impiden comprar solo con el teclado.

**Cobertura de requisitos**

| Medida | Cálculo | Resultado |
|---|---|---|
| Requisitos con al menos un caso (inicio de la sesión 9) | 7 de 8 (todos menos R2) | 88 % |
| Requisitos con al menos un caso (hoy) | 8 de 8 | 100 % |
| Requisitos con algún caso ejecutado | 8 de 8 | 100 % |
| Requisitos con todos sus casos aprobados | 1 de 8 (R7) | 13 % |
| Requisitos con algún caso fallido | 6 de 8 (todos menos R1 y R7) | 75 % |

*Nota: la cobertura mide la **presencia** de casos, no su calidad. R7 tiene «100 % aprobado» con un solo caso, y R2 está «cubierto» aunque su caso principal no se ha ejecutado.*

## 4. Acciones derivadas

| N.º | Acción | Responsable | Estado |
|---|---|---|---|
| 1 | Ejecutar CP-SL-201, 202 y 203 y actualizar la matriz. | Carlos Pingus | Pendiente |
| 2 | Tomar la captura de DEF-05 y registrar DEF-02 a DEF-05 en Jira; vincular DEF-01 como duplicado de SL-18. | Carlos Pingus | Pendiente |
| 3 | Agregar un caso de R7 con varios productos (por ejemplo, los 6: $129.94 + $10.40 = $140.34). | Carlos Pingus | Pendiente |
| 4 | Confirmar con el docente el formato de código postal (RQ-CP-01) antes de priorizar DEF-SL-001. | Carlos Pingus | Pendiente |
| 5 | Probar R8 con un lector de pantalla (NVDA) para cerrar CP-SL-210. | Carlos Pingus | Pendiente |

