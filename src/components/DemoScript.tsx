import { useState } from 'react';
import { ShoppingCart, Printer, Receipt, BarChart3, ChevronRight } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const STEPS = [
  {
    id: 1,
    icon: ShoppingCart,
    label: 'Toma de Pedido',
    title: 'Pantalla 100% visual, cero errores',
    description:
      'El mesero toca "Mesa 3", selecciona "Platillos Fuertes" y elige "Punta de Anca". El sistema pregunta de inmediato el término de la carne. Agrega la bebida y listo. Sin formularios, sin letra a mano, sin malentendidos.',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    stat: '3x',
    statLabel: 'más rápido que anotar en papel',
    highlight: 'Mesa 3 — Punta de Anca, Término Medio + Limonada de Coco',
  },
  {
    id: 2,
    icon: Printer,
    label: 'Comanda Automática',
    title: 'La cocina recibe la orden al instante',
    description:
      'Sin que el mesero camine un solo paso, la impresora térmica en cocina imprime el ticket: con letra de molde, clara, sin tachones. El mesero permanece en el salón atendiendo más mesas y vendiendo más.',
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=800',
    stat: '0',
    statLabel: 'pedidos perdidos en cocina',
    highlight: 'COMANDA #47 — Mesa 3 — Punta de Anca T.Medio / Limonada Coco',
  },
  {
    id: 3,
    icon: Receipt,
    label: 'Cierre de Cuenta',
    title: 'Pago flexible, inventario actualizado',
    description:
      'División de cuentas en segundos. Propina del 10% calculada automáticamente según la norma colombiana. Efectivo, tarjeta, Nequi o Daviplata. Al cerrar, el inventario de carne y bebidas se actualiza solo.',
    image: 'https://images.pexels.com/photos/4386339/pexels-photo-4386339.jpeg?auto=compress&cs=tinysrgb&w=800',
    stat: '$0',
    statLabel: 'descuadres en caja al final del día',
    highlight: 'Total: $68.000 | Efectivo / Nequi / Tarjeta | Propina: $6.800',
  },
  {
    id: 4,
    icon: BarChart3,
    label: 'Panel del Dueño',
    title: 'Tu restaurante desde el celular',
    description:
      'Desde cualquier lugar, en tiempo real: ventas brutas del día, mesas activas, plata en caja, plato más rentable del mes. Si un insumo se agota, recibes alerta automática al correo. Sin necesidad de estar en el local.',
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
    stat: '100%',
    statLabel: 'visibilidad desde el celular',
    highlight: 'Ventas hoy: $1.240.000 | 14 mesas | Caja: $680.000',
  },
];

export default function DemoScript() {
  const [active, setActive] = useState(0);
  const { ref, inView } = useInView();
  const step = STEPS[active];

  return (
    <section id="demo" className="py-24 bg-slate-50" ref={ref}>
      <div className="container-wide section-padding">
        {/* Header */}
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="badge bg-sky-50 text-sky-600 mb-4">Demostración</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-4 text-balance">
            El camino de un pedido
          </h2>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            Desde que el cliente se sienta hasta que se va — todo coordinado sin fricción.
          </p>
        </div>

        <div className={`flex flex-col lg:flex-row gap-8 transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Steps navigation */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="space-y-2">
              {STEPS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActive(i)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
                    active === i
                      ? 'bg-white border-brand-200 shadow-card-hover'
                      : 'bg-transparent border-transparent hover:bg-white hover:border-neutral-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                    active === i ? 'bg-brand-500 text-white' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${active === i ? 'text-brand-500' : 'text-neutral-400'}`}>
                      Paso {s.id}
                    </div>
                    <div className={`text-sm font-semibold truncate ${active === i ? 'text-neutral-900' : 'text-neutral-600'}`}>
                      {s.label}
                    </div>
                  </div>
                  {active === i && <ChevronRight className="w-4 h-4 text-brand-400 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Step detail */}
          <div className="flex-1">
            <div className="card overflow-hidden h-full">
              {/* Image */}
              <div className="relative h-52 md:h-64 overflow-hidden">
                <img
                  key={step.id}
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 to-transparent" />
                {/* Stat */}
                <div className="absolute bottom-4 left-6">
                  <div className="text-4xl font-bold text-white">{step.stat}</div>
                  <div className="text-sm text-white/80">{step.statLabel}</div>
                </div>
              </div>

              <div className="p-7">
                {/* Terminal-style highlight */}
                <div className="flex items-center gap-2 bg-slate-900 rounded-lg px-4 py-3 mb-6 font-mono text-xs overflow-x-auto">
                  <div className="flex gap-1.5 flex-shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <span className="text-green-400 ml-2 whitespace-nowrap">{step.highlight}</span>
                </div>

                <h3 className="font-display text-2xl font-bold text-neutral-900 mb-3">{step.title}</h3>
                <p className="text-neutral-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
