# Módulo de Pricing - Robomatic FE

## Descripción
Módulo Angular para mostrar planes de precios del servicio de emisión automática de boletas y facturas (DET).

## Características
✅ 3 planes de precios (Básico, Profesional, Empresarial)
✅ Diseño responsivo adaptado al tema oscuro de Robomatic
✅ Tarjetas interactivas con efectos hover
✅ Plan recomendado destacado (Profesional)
✅ Sección de características incluidas
✅ Sección de información adicional
✅ FAQ (Preguntas frecuentes)
✅ Completamente accesible (Bootstrap Icons)

## Planes Incluidos

### 1. Básico ($49.990 + IVA/mes)
- 50 documentos incluidos
- Emisión electrónica de boletas
- Facturación automática
- Soporte horario hábil (L-V)
- Reportes por ejecución

### 2. Profesional ($79.990/mes) ⭐ RECOMENDADO
- 200 documentos incluidos
- Emisión electrónica de boletas
- Facturación automática
- Soporte mejorado
- Reportes por ejecución

### 3. Empresarial ($99.990/mes)
- Documentos ilimitados
- Emisión electrónica de boletas
- Facturación automática
- Soporte 24/7
- Reportes por ejecución

## Estructura de Carpetas
```
src/app/pricing/
├── pricing.module.ts                    # Módulo principal
├── pages/
│   └── pricing/
│       ├── pricing.component.ts         # Componente principal
│       ├── pricing.component.html       # Template principal
│       └── pricing.component.css        # Estilos del contenedor
└── components/
    └── pricing-card/
        ├── pricing-card.component.ts    # Componente de tarjeta
        ├── pricing-card.component.html  # Template de tarjeta
        └── pricing-card.component.css   # Estilos de tarjeta
```

## Cómo Usar

### 1. Acceder al Módulo
La ruta del módulo es: `/pricing`

```bash
# Accede desde el navegador:
http://localhost:4200/pricing
```

### 2. Integración en Navegación
Para añadir un enlace en la navegación, edita el archivo donde desees incluirlo:

```typescript
// Ejemplo en un componente de navegación
<a routerLink="/pricing" class="nav-link">Planes de Precios</a>
```

### 3. Personalizar Planes
Para modificar los planes, edita `pricing.component.ts` en el método `initializePricingPlans()`:

```typescript
{
  id: 'basico',
  name: 'Básico',
  price: 49990,           // Cambiar precio
  currency: '$',
  period: '/mes',
  description: 'Perfecto para comenzar',
  documents: '50',        // Cambiar cantidad de documentos
  features: [
    // Añadir o eliminar características
  ],
  highlighted: false,     // Establecer como destacado (true/false)
  ctaText: 'Comenzar Prueba Gratis',
  ctaAction: () => this.handleTrialSignup('basico')
}
```

## Personalización de Estilos

### Colores Principales
El módulo utiliza las variables CSS de Robomatic:
- `--primary`: #00ddeb (Cyan)
- `--secondary`: #2b7a55 (Verde)
- `--maindark`: #171717
- `--dark`: #212121
- `--offwhite`: #f2f2f2
- `--grey`: #9c9c9c

### Cambiar Colores
Modifica `pricing-card.component.css` y `pricing.component.css` para ajustar colores:

```css
/* Ejemplo: Cambiar color del título */
.plan-name {
  color: var(--primary); /* Cambia a otro color si deseas */
}
```

## Funcionalidad de CTA (Call-to-Action)

Por defecto, el botón "Comenzar Prueba Gratis" ejecuta `handleTrialSignup()`. 

Para implementar la lógica real, edita `pricing.component.ts`:

```typescript
handleTrialSignup(planId: string): void {
  // Opción 1: Navegar a página de registro
  this.router.navigate(['/register'], { queryParams: { plan: planId } });

  // Opción 2: Abrir un modal
  // this.modalService.open(SignupModal, { componentInstance: { planId } });

  // Opción 3: Llamar a un servicio
  // this.pricingService.startTrial(planId).subscribe(...);
}
```

## Bootstrap Icons
El módulo usa Bootstrap Icons para los iconos de verificación y características.

Asegúrate de que Bootstrap Icons esté instalado:

```bash
npm install bootstrap-icons
```

E importado en el CSS global (`styles.css`):

```css
@import 'bootstrap-icons/font/bootstrap-icons.css';
```

## Responsive Design
El módulo es totalmente responsivo:
- **Desktop**: Grid de 3 columnas
- **Tablet**: Grid de 2-3 columnas (auto-fit)
- **Mobile**: 1 columna

## Accesibilidad
✅ Colores con suficiente contraste
✅ Iconos con etiquetas ARIA
✅ Botones accesibles (focus states)
✅ Navegación por teclado soportada

## Próximas Mejoras Sugeridas
- [ ] Integración con servicio de pagos (Stripe, Mercado Pago)
- [ ] Comparador interactivo de features
- [ ] Testimonio de clientes
- [ ] Calculadora de ROI
- [ ] Prueba gratuita de 7 días
- [ ] Chat de soporte integrado

## Testing
Para incluir tests unitarios, añade en `pricing.component.spec.ts`:

```typescript
it('should display 3 pricing plans', () => {
  const cards = fixture.debugElement.queryAll(By.directive(PricingCardComponent));
  expect(cards.length).toBe(3);
});

it('should highlight the professional plan', () => {
  const professionalPlan = component.pricingPlans.find(p => p.id === 'profesional');
  expect(professionalPlan.highlighted).toBe(true);
});
```

## Soporte
Para cualquier duda o mejora, contacta al equipo de desarrollo.
