import { Quote } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const TESTIMONIALS = [
  {
    quote: 'Antes cerrábamos caja rezando. Ahora todo cuadra al centavo. Las comandas automáticas cambiaron el juego — mis meseros atienden más mesas y la cocina no comete errores.',
    name: 'Carlos Mendoza',
    role: 'Propietario, Parrilla El Corral',
    city: 'Barranquilla',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    quote: 'Lo que más me gustó fue la garantía de 7 días. Pensé que era un riesgo, pero al segundo día ya veía la diferencia. Nunca más volví a tener descuadres con Nequi y tarjeta.',
    name: 'Sandra Ospina',
    role: 'Administradora, Fritanga Doña Sandra',
    city: 'Medellín',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    quote: 'Viajo mucho y siempre me preocupaba dejar el restaurante solo. Ahora abro el teléfono y veo todo en tiempo real: cuánto se vendió, qué mesas están abiertas, cuánta plata hay en caja.',
    name: 'Jorge Patiño',
    role: 'Dueño, Rancho Grande Cocina',
    city: 'Cali',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];

export default function Testimonials() {
  const { ref, inView } = useInView();

  return (
    <section className="py-24 bg-white" ref={ref}>
      <div className="container-wide section-padding">
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="badge bg-emerald-50 text-emerald-600 mb-4">Testimonios</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-4 text-balance">
            Restauranteros que ya lo vivieron
          </h2>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`card p-7 flex flex-col transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 100 + 200}ms` }}
            >
              <Quote className="w-8 h-8 text-brand-200 mb-5 flex-shrink-0" />
              <p className="text-neutral-600 leading-relaxed flex-1 mb-6 text-sm">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <div className="font-semibold text-neutral-900 text-sm">{t.name}</div>
                  <div className="text-xs text-neutral-400">{t.role}</div>
                  <div className="text-xs text-brand-500 font-medium">{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
