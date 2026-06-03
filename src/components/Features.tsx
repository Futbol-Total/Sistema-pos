import { Smartphone, Printer, Utensils, BarChart3, CloudOff, CreditCard } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const FEATURES = [
  {
    icon: Utensils,
    title: 'Toma de Pedidos Visual',
    description: 'Menú 100% visual con fotos. El mesero toca la mesa, selecciona el plato y personaliza al instante. Cero errores, máxima velocidad.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Printer,
    title: 'Comandas Automáticas',
    description: 'En el mismo segundo que se toma el pedido, la comanda se imprime en cocina con letra de molde. El mesero nunca camina innecesariamente.',
    color: 'bg-sky-50 text-sky-600',
  },
  {
    icon: CreditCard,
    title: 'Múltiples Medios de Pago',
    description: 'Efectivo, tarjeta, Nequi y Daviplata. División de cuentas automática, propina del 10% calculada según la norma colombiana.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Smartphone,
    title: 'Panel del Dueño Móvil',
    description: 'Desde tu celular en tiempo real: ventas del día, mesas ocupadas, caja, platos más rentables y alertas de inventario.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: BarChart3,
    title: 'Control de Inventario',
    description: 'Cada venta descuenta los insumos automáticamente. Alertas cuando un producto se está agotando, sin hojas de cálculo.',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: CloudOff,
    title: 'Funciona sin Internet',
    description: 'Base de datos híbrida local. Si Claro, Movistar o Tigo falla, el restaurante sigue operando. Al volver la señal, sincroniza solo.',
    color: 'bg-slate-100 text-slate-600',
  },
];

export default function Features() {
  const { ref, inView } = useInView();

  return (
    <section id="caracteristicas" className="py-24 bg-white" ref={ref}>
      <div className="container-wide section-padding">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="badge bg-brand-50 text-brand-600 mb-4">Características</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-4 text-balance">
            Todo lo que tu restaurante necesita
          </h2>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            Diseñado para la operación real de restaurantes colombianos, desde la mesa hasta el cierre de caja.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className={`card p-7 group transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-neutral-900 text-lg mb-2">{feature.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
