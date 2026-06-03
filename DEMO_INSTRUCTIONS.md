# RestoPOS — Sistema Interactivo Completamente Funcional

Has construido una demostración de POS totalmente funcional, personalizable y lista para mostrar a restauranteros. El sistema incluye:

## 🎯 Características Principales

### 1. **Página de Ventas (Landing Page)**
- Narrativa completa: problema → solución → demostración → precios
- Secciones que cuentan la historia de cómo RestoPOS resuelve problemas reales
- Llamadas a acción claras ("Ver Demo Interactivo", "Agendar Implementación")
- Diseño premium con animaciones suaves y colores profesionales (naranja y neutral)

### 2. **Sistema POS Interactivo (`/demo`)**

**Flujo Completo de Una Orden:**

1. **Seleccionar Mesa**
   - Grid visual de mesas (1-5 en la demo)
   - Indica capacidad y estado de ocupación
   - Marca la mesa seleccionada con naranja

2. **Tomar Pedido**
   - Menú visual 100% clickeable
   - Categorías: Platillos Fuertes, Bebidas, Postres
   - Productos con nombre, descripción y precio
   - Carrito en tiempo real que actualiza en el lado derecho

3. **Gestionar Carrito**
   - Agregar/quitar cantidades con botones +/-
   - Eliminar items con botón X
   - Muestra subtotal, impuesto (8%) y total
   - Propina sugerida del 10% (según norma colombiana)
   - Selecciona medio de pago: Efectivo, Tarjeta, Nequi, Daviplata

4. **Cerrar Cuenta**
   - Modal de confirmación con monto total
   - Advertencia sobre verificar pago del cliente
   - Éxito: limpia la mesa y permite nueva orden
   - Datos sincronizados automáticamente en Supabase

### 3. **Panel de Administración (`/admin`)**

**Personaliza el menú sin código:**

- Edita nombre, precio y descripción de cada producto
- Vista clara de categoría y disponibilidad
- Cambios se guardan automáticamente en la base de datos
- Los cambios aparecen inmediatamente en el POS Demo
- Incluye instrucciones para el flujo de demostración

## 📊 Base de Datos (Supabase)

Las tablas están preconfiguradas con datos de demostración:

- **restaurants** — Configuración (nombre, moneda, impuesto)
- **categories** — Platillos Fuertes, Bebidas, Postres
- **products** — Punta de Anca, Desgranado, Limonada de Coco, etc.
- **tables** — Mesas 1-5 con capacidades
- **orders** — Órdenes abiertas/cerradas
- **order_items** — Detalles de cada línea en la orden

## 🎬 Cómo Usar en tu Presentación

### Paso 1: Muestra la Página de Ventas
1. Abre la URL raíz (`/`)
2. Recorre todas las secciones: Características, Demo Script, Precios, FAQ
3. Esto establece el contexto del problema y la solución

### Paso 2: Personaliza el Menú (5 minutos)
1. Abre `/admin`
2. Edita los productos con platos REALES de su restaurante:
   - Cambia "Punta de Anca" por su entrada favorita
   - Cambia precios a los que cobran realmente
   - Agrega descripciones personalizadas
3. **Consejo:** Haz esto EN FRENTE del dueño. Muestra cuánto control tiene.

### Paso 3: Demuestra el Flujo Completo (`/demo`)
1. **Abre el POS** en una tablet o laptop
2. **Mesa 1:** Toma una orden:
   - Toca Mesa 1 → Platillos Fuertes → Punta de Anca
   - Agrega Limonada de Coco
   - Muestra que el mesero NO camina, el pedido está en pantalla
3. **Comanda Automática:**
   - (En un POS real, impresora térmica imprimo aquí)
   - Menciona: "En cocina ya ven el pedido claro, sin errores"
4. **Cierre de Cuenta:**
   - Toca "Cerrar Cuenta"
   - Muestra división de medios de pago
   - Propina automática
   - Confirmación de pago → Modal de éxito

### Paso 4: Cierra con los Beneficios
- Cero descuadres en caja
- Meseros atienden más mesas
- Panel del dueño en tiempo real (móvil)
- Si internet falla, sigue funcionando
- 7 días de garantía sin riesgo

## 🔧 Cómo Modificar

### Agregar un Nuevo Producto
1. Accede a Supabase directamente (console)
2. Tabla `products`, inserta fila con:
   - `name`: Nombre del plato
   - `price`: Precio en COP
   - `category_id`: ID de categoría
   - `description`: Descripción corta
3. Recarga `/demo` — aparece al instante

### Cambiar Precios Rápidamente
- Usa `/admin` — ahí es lo más fácil
- Edita, guarda → cambios en vivo

### Agregar Más Mesas
- Supabase → tabla `tables` → inserta fila
- `table_number`: 6, 7, 8, etc.
- `capacity`: Cuántas personas

### Cambiar el Nombre del Restaurante
- Supabase → tabla `restaurants`
- Edita `name` donde `name = 'Restaurante Demo'`

## 🎨 Personalización de Diseño

- **Colores:** Edita `tailwind.config.js` — sección `colors`
- **Fuentes:** Inter (sans) y Playfair Display (display)
- **Espaciado:** Sistema 8px en `tailwind.config.js`
- **Animaciones:** Definidas en `index.css`

## 📱 URLs Importantes

| URL | Propósito |
|-----|-----------|
| `/` | Página de ventas completa |
| `/demo` | POS interactivo (demostración en vivo) |
| `/admin` | Panel para editar menú |

## ⚡ Flujo Técnico Interno

1. **App.tsx** — Detecta ruta, renderiza componente correcto
2. **POSSystem.tsx** — Interfaz POS principal
3. **lib/api.ts** — Funciones para leer/escribir en Supabase
4. **lib/supabase.ts** — Cliente Supabase y tipos TypeScript

Cada interacción en el POS escribe a la base de datos en tiempo real. Los datos persisten y puedes seguir desde donde dejaste.

## 🚀 Tips para Impresionar

1. **Cambia el menú EN VIVO** mientras el dueño mira → muestra control
2. **Toma una orden completa** desde mesa hasta cierre → demuestra flujo integral
3. **Menciona los medios de pago** que ven en pantalla → Nequi, Daviplata
4. **Habla de lo que NO ven:** "Si internet falla, esto sigue funcionando"
5. **Cierra con urgencia:** "Tres cupos disponibles, ¿iniciamos esta semana?"

## 💡 Próximos Pasos (Si quieres mejorar aún más)

- Agregar foto a cada producto (URL en `image_url`)
- Reportes de ventas por día/mes
- Historial de órdenes cerradas
- Integraciones con impresora térmica real
- App móvil para meseros
- Dashboard del dueño con métricas

¡Estás listo para vender! 🎉
