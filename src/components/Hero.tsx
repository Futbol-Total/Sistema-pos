import { ArrowRight, ShieldCheck, Wifi, Clock } from 'lucide-react';

const TRUST_BADGES = [
  { icon: ShieldCheck, text: '7 días de garantía' },
  { icon: Wifi, text: 'Funciona sin internet' },
  { icon: Clock, text: 'Soporte 24/7 incluido' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-900">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Restaurante colombiano"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/75 to-slate-800/60" />
        <div className="absolute inset-0 bg-hero-pattern opacity-100" />
      </div>

      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative container-wide section-padding pt-28 pb-20">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/15 border border-brand-500/30 backdrop-blur-sm mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse-slow" />
            <span className="text-brand-300 text-sm font-semibold tracking-wide uppercase">
              Sistema POS para Restaurantes en Colombia
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance animate-fade-in-up animate-delay-100">
            El Cerebro de{' '}
            <span className="text-brand-400 relative">
              tu Restaurante
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M3 9C50 3 100 1 150 3C200 5 250 3 297 9" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed animate-fade-in-up animate-delay-200">
            Recupera el control total de tu negocio. Elimina las fugas de dinero, coordina cocina y salón en tiempo real, y toma decisiones desde tu celular — estés donde estés.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-14 animate-fade-in-up animate-delay-300">
            <a href="/demo" className="btn-primary text-base px-7 py-3.5 shadow-brand-lg">
              Ver Demo Interactivo
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#precios" className="btn-secondary text-base px-7 py-3.5 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm">
              Ver Precios
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6 animate-fade-in-up animate-delay-400">
            {TRUST_BADGES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-slate-300">
                <Icon className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
