import { useInView } from '../hooks/useInView';
import { TrendingUp, Users, Clock, Award } from 'lucide-react';

const STATS = [
  { icon: TrendingUp, value: '+35%', label: 'Incremento en ventas', sub: 'promedio el primer trimestre' },
  { icon: Users, value: '150+', label: 'Restaurantes activos', sub: 'en todo Colombia' },
  { icon: Clock, value: '99.8%', label: 'Uptime garantizado', sub: 'con modo offline' },
  { icon: Award, value: '7 días', label: 'Garantía sin riesgo', sub: 'o te devolvemos el dinero' },
];

export default function Stats() {
  const { ref, inView } = useInView();

  return (
    <section className="py-16 bg-brand-500" ref={ref}>
      <div className="container-wide section-padding">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-white font-semibold text-sm mb-0.5">{stat.label}</div>
              <div className="text-brand-200 text-xs">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
