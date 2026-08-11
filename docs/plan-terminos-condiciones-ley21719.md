# Actualización de Términos y Condiciones — Ley 21.719 (Chile)

> **Fecha del plan:** Julio 2026  
> **Origen:** Tarjeta Trello "revisar terminos y condiciones para chile" (lista Doing)  
> **Estado:** Pendiente de implementación

## Contexto

Actualizar los Términos y Condiciones de Robomatic para cumplir con la **Ley N° 21.719 de Protección de Datos Personales** de Chile (vigencia: 1 de diciembre de 2026). La ley establece derechos ARCOP, exige consentimiento explícito, crea la Agencia de Protección de Datos Personales, y contempla sanciones de hasta 20.000 UTM.

## Decisiones Confirmadas

| Pregunta | Respuesta |
|----------|-----------|
| Idiomas | Mantener: ES en página completa y register, EN en login |
| Nivel de detalle | General (informativo, no tipo política de privacidad detallada) |
| Email para derechos ARCOP | `contacto@robomatic.cloud` |
| Transferencia internacional | Sí — servidor principal en EEUU |
| Delegado de Protección de Datos | No hay por ahora |

## Cambios Propuestos

### 1. Página completa de Términos y Condiciones

**Archivo:** `src/app/components/pages/terms-conditions/terms-conditions.component.html`

- Agregar **nueva sección 8**: "Protección de Datos Personales (Ley 21.719)" con:
  - Datos recopilados (nombre, email, teléfono, datos de uso)
  - Bases de legitimación (consentimiento explícito, ejecución del servicio)
  - Derechos ARCOP (Acceso, Rectificación, Supresión, Oposición, Portabilidad, Bloqueo) — canal: `contacto@robomatic.cloud`, plazo 30 días hábiles
  - Transferencia internacional (servidor en EEUU, medidas adecuadas)
  - Retención de datos (mientras la cuenta esté activa)
  - Agencia de Protección de Datos Personales como ente fiscalizador
- Renumerar secciones 8→9 hasta 11→12
- Actualizar sección "Ley Aplicable" para mencionar la Ley 21.719

**Archivo:** `src/app/components/pages/terms-conditions/terms-conditions.component.ts`

- Actualizar `lastUpdated` a `"Julio 2026"`

---

### 2. Modal de Términos en Login (EN)

**Archivo:** `src/app/components/pages/login/login.component.html`

- Agregar sección resumida "8. Data Protection (Law 21,719)" en inglés:
  - Compliance statement, ARCOP rights, international transfer (US servers), contact channel
- Renumerar: Applicable Law → 9, Contact → 10

---

### 3. Modal de Términos en Register (ES)

**Archivo:** `src/app/components/pages/register/register.component.html`

- Agregar sección resumida "8. Protección de Datos Personales (Ley 21.719)" en español:
  - Declaración de cumplimiento, derechos ARCOP, transferencia internacional (EEUU), canal de contacto
- Renumerar: Ley Aplicable → 9, Contacto → 10

## Verificación

1. Ejecutar `ng serve` y navegar a la página de Términos para verificar la nueva sección 8
2. Verificar modal de login (Sign Up → Terms and Conditions): sección "8. Data Protection"
3. Verificar modal de register: sección "8. Protección de Datos Personales"
4. Confirmar numeración correcta en los 3 archivos
