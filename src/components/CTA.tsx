import { ArrowRight, MessageCircle } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export default function CTA() {
  const { ref, inView } = useInView();

  return (
    <section className="py-24 bg-white" ref={ref}>
      <div className="container-narrow section-padding">
        <div className={`relative bg-slate-900 rounded-3xl overflow-hidden transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Restaurante"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-800" />
          </div>

          {/* Glow effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative px-8 py-16 md:px-16 text-center">
            <div className="badge bg-brand-500/20 text-brand-300 border border-brand-500/30 mb-6">
              Quedan 3 cupos disponibles
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5 text-balance">
              ¿Listo para recuperar el control?
            </h2>
            <p className="text-lg text-slate-300 max-w-xl mx-auto mb-10 leading-relaxed">
              Agenda la carga de tu menú esta semana. La implementación es gratuita y tienes 7 días para comprobarlo sin riesgo.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/demo"
                className="btn-primary text-base px-8 py-4 shadow-brand-lg"
              >
                Ver Demo Interactivo
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="mailto:ventas@restopos.co?subject=Quiero la Oferta Especial RestoPOS"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 text-base backdrop-blur-sm"
              >
                Agendar Implementación
              </a>
            </div>
            <p className="text-sm text-slate-500 mt-6">
              Sin contrato · Sin permanencia · 7 días de garantía de satisfacción
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
