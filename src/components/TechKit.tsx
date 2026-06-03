import { Tablet, Printer, FileText, Database } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const KIT_ITEMS = [
  {
    icon: Tablet,
    number: '01',
    title: 'Hardware de Demostración',
    description: 'Una tableta de mínimo 10 pulgadas (o computador portátil para caja) con la aplicación instalada y lista para operar.',
    tip: 'Lleva el cargador. La batería en medio de la demo es un desastre.',
    color: 'bg-sky-500',
  },
  {
    icon: Printer,
    number: '02',
    title: 'Impresora Térmica',
    description: 'Bluetooth o USB, de 58mm o 80mm. Con un rollo de papel nuevo. Nada convence más que escuchar la impresora en vivo.',
    tip: 'La impresión en vivo es el momento WOW de la demo. No te la saltes.',
    color: 'bg-amber-500',
  },
  {
    icon: Database,
    number: '03',
    title: 'Base de Datos Demo',
    description: 'Precargada con platos reales de la gastronomía local: Punta de Anca, Limonada de Coco, Hamburguesa de la Casa, Desgranado. Con fotos de alta calidad en cada botón.',
    tip: 'Nada de "Producto A" o "Bebida 1". El dueño debe ver SU tipo de restaurante.',
    color: 'bg-emerald-500',
  },
  {
    icon: FileText,
    number: '04',
    title: 'Contrato Listo para Firmar',
    description: 'Una orden de servicio impresa o digital, lista para el momento en que el cliente diga "¡Arrancamos!". No pierdas un cierre por no tener el papel.',
    tip: 'Tener el contrato es señal de profesionalismo. Sin él, el entusiasmo se enfría.',
    color: 'bg-rose-500',
  },
];

export default function TechKit() {
  const { ref, inView } = useInView();

  return (
    <section id="kit-tecnico" className="py-24 bg-slate-900" ref={ref}>
      <div className="container-wide section-padding">
        {/* Header */}
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="badge bg-white/10 text-slate-300 mb-4">Kit Técnico</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
            Lo que llevas a la visita
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            No muestres el sistema en diapositivas. El restaurantero vende comida real — tú debes vender software real.
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {KIT_ITEMS.map((item, i) => (
            <div
              key={item.title}
              className={`bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/8 hover:border-white/20 transition-all duration-300 group ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 100 + 200}ms` }}
            >
              <div className="flex items-start gap-5">
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{item.number}</div>
                  <h3 className="font-semibold text-white text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{item.description}</p>
                  <div className="flex items-start gap-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
                    <span className="text-amber-400 text-xs font-bold uppercase tracking-wide flex-shrink-0 mt-0.5">Pro tip</span>
                    <p className="text-amber-300/80 text-xs leading-relaxed">{item.tip}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
