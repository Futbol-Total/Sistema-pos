# 🎯 GUÍA PRÁCTICA DE DEMOSTRACIÓN — RestoPOS

## Antes de la demostración

### Paso 0: Prepara tu dispositivo (5 min antes)

1. Abre el navegador y ve a la raíz del proyecto
2. Verifica que todas las URLs funcionan:
   - `http://localhost:5173/` (Home)
   - `http://localhost:5173/demo` (POS)
   - `http://localhost:5173/admin` (Admin)

### Paso 0.5: Ten estos números listos

```
Ingresos de hoy:  $1.240.000 COP
Órdenes: 12 pedidos
Ticket promedio: $103.333
Propinas: $120.000
```

Estos números vienen en vivo del dashboard `/admin`.

---

## 🎬 Flujo de Demostración (20 minutos)

### **BLOQUE 1: ENTRADA (2 minutos)**

**Lo que dices:**
> "Hola [Nombre], sé que tu tiempo es oro. Un restaurante moderno enfrenta un reto: coordinar meseros, cocina, caja y personal — todo sin que se escapen órdenes ni dinero."

**Lo que haces:**
1. Abre `/` (Home page)
2. Deja que vea el héroe 5 segundos
3. Señala: "Esto es RestoPOS — nuestro sistema"

---

### **BLOQUE 2: CONTEXTO Y PROBLEMA (3 minutos)**

**Permanece en: `/`**

**Lo que dices:**
> "Déjame mostrarle las tres cosas que más duelen en un restaurante:

1. **Meseros** que andan de un lado a otro sin tomar órdenes bien
2. **Cocina** que recibe papeles arrugados, se equivoca, tira comida
3. **Caja** que al final no cuadra — faltan pesos, sobra dinero, descuadres"

**Lo que haces:**
- Scroll lentamente por las secciones de Features
- Apunta cada punto de dolor
- Pausa en "Demo Script" para mostrar el flujo

---

### **BLOQUE 3: DEMOSTRACIÓN LIVE DEL ADMIN (5 minutos)**

**Cambia a: `/admin`**

**Lo que dices:**
> "Aquí está tu tablero de control. Todo lo que necesitas saber de tu negocio en una pantalla."

#### Paso 3.1: Muestra los 4 KPIs

Señala cada métrica:
```
"Hoy entraron 12 órdenes
Ganaste $1.240.000
El cliente promedio gastó $103.333
Recibiste $120.000 en propinas"
```

**Acción:** Espera a que procese la información. Deja que lo asimile.

#### Paso 3.2: Top Productos

Señala:
> "Tus productos estrella: Punta de Anca lidera. Sabes exactamente qué vender mañana."

#### Paso 3.3: Medios de Pago

Apunta:
> "De tus clientes: 42% pagan en efectivo, 33% en tarjeta, 17% Nequi, 8% Daviplata. 
> Así sabes qué dispositivos tener listos mañana."

#### Paso 3.4: EL MOMENTO MÁGICO — Edita un Producto EN VIVO

**Instrucciones:**
1. Baja hasta "Gestionar Productos"
2. Haz clic en Edit (lápiz) en cualquier producto
3. Cambia el precio: de $65.000 a $68.000
4. Haz clic en "Guardar"
5. **Dile:** "El cambio se guarda automáticamente. Sin código, sin técnicos."

**Espera 5 segundos.**

> "Dentro de 2 segundos, este precio está disponible en el POS para tus meseros."

---

### **BLOQUE 4: DEMOSTRACIÓN POS — ORDEN COMPLETA (10 minutos)**

**Cambia a: `/demo`**

**Lo que dices:**
> "Ahora vamos a tomar una orden. Esto es lo que ven tus meseros. Fácil, rápido, sin errores."

#### Paso 4.1: Selecciona Mesa

Señala el grid de mesas:
> "El mesero llega con un cliente. Toca Mesa 1 — boom."

**Haz clic en:** Mesa 1 (se pone naranja)

#### Paso 4.2: Categorías

Señala:
> "Nuestro menú está organizado. Platillos, Bebidas, Postres. El mesero no se pierde."

Deja visible "Platillos Fuertes".

#### Paso 4.3: Agrega Items

**Paso 4.3.1:** Haz clic en "Punta de Anca"
> "El cliente quiere la estrella del menú."

Apunta al carrito derecho:
> "Mira — ya aparece aquí. El mesero continúa tomando orden."

**Paso 4.3.2:** Haz clic en "Limonada de Coco"
> "Bebida. Agregada."

**Resultado esperado:**
```
Orden:
├─ Punta de Anca x1: $68.000 (¡El precio nuevo!)
└─ Limonada x1: $12.000
```

#### Paso 4.4: Carrito Automático

Señala el carrito derecho:
> "Sistema calcula impuestos colombianos al 8%, suma, y sugiere propina del 10%.
> El mesero nunca toma calculadora. Cero errores."

Apunta:
```
Subtotal: $80.000
Impuesto: $6.400
TOTAL: $86.400
Propina (10%): $8.640
```

#### Paso 4.5: Medio de Pago

Señala los 4 botones:
> "El cliente elige: efectivo, tarjeta, Nequi, Daviplata. Listo."

Haz clic en: **Nequi** (se pone naranja)

> "Sistema registra el medio. Sabe exactamente de dónde vino cada peso."

#### Paso 4.6: Cerrar Cuenta

Haz clic en: **"Cerrar Cuenta"**

Aparece modal de confirmación:
> "Seguridad. No se cierra sin confirmación."

Haz clic en: **"Confirmar Pago"**

Modal de éxito:
> "¡Orden completa! Guardada en la base de datos. Sincronizada."

---

### **BLOQUE 5: FULL CIRCLE — VUELVE AL ADMIN (2 minutos)**

**Cambia a: `/admin`**

Baja hasta "Órdenes Recientes":

> "Vuelvo al tablero. ¿Ves? La orden que acabamos de tomar **ya está aquí**. 
> Total: $86.400
> Medio de pago: Nequi
> Hora: [la hora actual]
>
> Todo en tiempo real. Sin esperar. Sin sincronización manual."

---

### **BLOQUE 6: EL CIERRE — VUELVE A HOME (3 minutos)**

**Cambia a: `/`**

Baja hasta la sección de **Precios**:

> "Ahora te muestro la inversión. La tarifa regular es $650.000 implementación + $260.000 mensuales.
>
> PERO — como seleccioné tres restaurantes para ser casos de éxito de la zona:
> - **Implementación GRATIS:** Te ahorras $650.000
> - **Mensualidad congelada:** $195.000/mes (te ahorras $780.000 al año)
> - **7 días de garantía:** Si no te convence, lo retiramos sin cobrar nada.

Espera silencio.

> "¿Qué piensas? ¿Podemos agendar el montaje para esta [Día de la semana]?"

---

## 📊 Datos Clave que Debes Saber

### Restaurante Demo
```
Nombre: Restaurante Demo
Moneda: COP
Impuesto: 8%
```

### Productos (5 en total)
```
Punta de Anca        $68.000 (¡EDITABLE!)
Desgranado           $45.000
Hamburguesa          $35.000
Limonada de Coco     $12.000
Jugo Natural         $8.000
```

### Mesas (5 en total)
```
Mesa 1: 2 personas
Mesa 2: 2 personas
Mesa 3: 4 personas
Mesa 4: 4 personas
Mesa 5: 6 personas
```

---

## 🎯 Momentos Clave para Impresionar

### Momento 1️⃣ — Editar EN VIVO
**Qué haces:** Cambias un precio en `/admin`
**Qué dices:** "Sin código, sin técnicos, sin esperar"
**Por qué funciona:** Muestra que CONTROLA el negocio

### Momento 2️⃣ — El Precio Nuevo en POS
**Qué haces:** El producto que editaste aparece con precio nuevo en `/demo`
**Qué dices:** "Los cambios están listos en 2 segundos"
**Por qué funciona:** Demuestra sincronización en tiempo real

### Momento 3️⃣ — Orden en Órdenes Recientes
**Qué haces:** Completas una orden y reaparece en el admin
**Qué dices:** "Todo grabado. Cero margen de error."
**Por qué funciona:** Cierra el loop: propuesta → demostración → cierre

### Momento 4️⃣ — La Oferta
**Qué haces:** Muestras que implementación es gratis
**Qué dices:** "Solo para los tres primeros casos de éxito"
**Por qué funciona:** Urgencia + certeza = cierre

---

## 🚨 Si Algo Falla

### "No carga admin"
→ Refresca `/admin`
→ Espera 5 segundos a que carguen datos

### "El carrito no actualiza"
→ Es normal cada 2 segundos
→ Dile: "Está sincronizando desde nube"

### "Precio no cambió en POS"
→ Refresca `/demo`
→ Dile: "Aquí viene el cambio"

### "Orden no aparece en recientes"
→ Refresca `/admin`
→ Dile: "Base de datos refrescando"

---

## ✅ Checklist Pre-Demo

- [ ] 3 URLs funcionan (home, demo, admin)
- [ ] Admin carga con datos (si no, refresca)
- [ ] POS muestra 5 mesas
- [ ] Menú tiene productos
- [ ] Puedes editar un producto en admin
- [ ] Puedes completar una orden en POS
- [ ] Vuelves a admin y ves la orden

---

## 🎤 Frases Clave

**Para cerrar:**
> "Sin contrato de permanencia. Sin multas. Una garantía de 7 días.
> Si no te convence, nos vamos amigos. Confío en mi sistema."

**Para urgencia:**
> "Tres cupos disponibles para este mes. Te ofrezco esta tarifa especial si decidimos hoy."

**Para cierre final:**
> "¿Listo? Empezamos esta [Día]? Llevo el hardware, todo preconfigurado, el menú cargado, el equipo capacitado."

---

¡**ÉXITO EN TU DEMOSTRACIÓN!** 🚀

Recuerda: No es sobre la tecnología. Es sobre **cómo el negocio funciona mejor** con RestoPOS.

Mantén el foco en los **problemas resueltos**, no en los **botones presionados**.
