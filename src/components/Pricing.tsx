import { useState } from 'react';
import { Check, X, Zap, Star, ArrowRight } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const OFFER_TABLE = [
  {
    component: 'Implementación, Configuración y Capacitación',
    regular: '$650.000 COP',
    special: 'Gratis',
    saving: '$650.000 COP',
    isFree: true,
  },
  {
    component: 'Suscripción Mensual (Soporte 24/7 + Nube)',
    regular: '$260.000 / mes',
    special: '$195.000 / mes',
    saving: '$780.000 al año',
    isFree: false,
  },
  {
    component: 'Actualizaciones de Software',
    regular: 'Incluidas',
    special: 'Incluidas',
    saving: 'Para siempre',
    isFree: false,
  },
  {
    component: 'Garantía de Satisfacción',
    regular: 'No aplica',
    special: '7 días de prueba',
    saving: 'Riesgo Cero',
    isFree: false,
  },
];

const INCLUDES = [
  'Diseño del mapa de mesas de tu restaurante',
  'Carga de hasta 150 productos con fotos de alta calidad',
  'Configuración de impresoras y comanderas',
  '2 jornadas de capacitación al personal',
  'Soporte prioritario 24/7 (fines de semana incluidos)',
  'Panel de dueño accesible desde cualquier celular',
  'Funciona sin internet (modo offline)',
  'Sin contrato de permanencia',
];

type Tab = 'monthly' | 'annual';

export default function Pricing() {
  const [tab, setTab] = useState<Tab>('monthly');
  const { ref, inView } = useInView();

  const monthlySpecial = 195000;
  const annualTotal = 2600000;
  const annualMonthly = Math.round(annualTotal / 12);

  return (
    <section id="precios" className="py-24 bg-white" ref={ref}>
      <div className="container-wide section-padding">
        {/* Header */}
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="badge bg-brand-50 text-brand-600 mb-4">Precios</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-4 text-balance">
            Inversión que se paga sola
          </h2>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            Seleccionamos los 3 mejores restaurantes de la zona como casos de éxito. Si decides hoy, accedes a la tarifa preferencial.
          </p>
        </div>

        <div className={`transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Toggle */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-neutral-100 rounded-xl p-1 gap-1">
              <button
                onClick={() => setTab('monthly')}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  tab === 'monthly' ? 'bg-white shadow-card text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                Mensual
              </button>
              <button
                onClick={() => setTab('annual')}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  tab === 'annual' ? 'bg-white shadow-card text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                Anual
                <span className="badge bg-success-100 text-success-700 py-0.5 text-[10px]">2 meses gratis</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Regular plan */}
            <div className="card p-8 border-neutral-200">
              <div className="mb-6">
                <div className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-1">Plan Regular</div>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-neutral-900">
                    {tab === 'monthly' ? '$260.000' : '$2.600.000'}
                  </span>
                  <span className="text-neutral-400 mb-1">{tab === 'monthly' ? '/ mes' : '/ año'}</span>
                </div>
                {tab === 'annual' && (
                  <div className="text-sm text-neutral-400 mt-1">($216.667 / mes)</div>
                )}
                <div className="mt-3 text-sm text-neutral-500">
                  + $650.000 COP implementación
                </div>
              </div>
              <div className="space-y-3">
                {INCLUDES.slice(0, 5).map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-500">{item}</span>
                  </div>
                ))}
                <div className="flex items-start gap-3">
                  <X className="w-4 h-4 text-danger-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-neutral-400">Garantía de satisfacción</span>
                </div>
              </div>
            </div>

            {/* Special offer */}
            <div className="relative card p-8 border-2 border-brand-400 bg-gradient-to-br from-brand-50/60 to-white overflow-hidden">
              {/* Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />

              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm font-semibold text-brand-500 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      Oferta Especial — Hoy
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-bold text-neutral-900">
                        {tab === 'monthly' ? '$195.000' : '$2.340.000'}
                      </span>
                      <span className="text-neutral-500 mb-1">{tab === 'monthly' ? '/ mes' : '/ año'}</span>
                    </div>
                    {tab === 'annual' && (
                      <div className="text-sm text-brand-500 font-medium mt-1">($195.000 / mes)</div>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-sm line-through text-neutral-400">$650.000 implementación</span>
                      <span className="badge bg-success-100 text-success-700 py-0.5">GRATIS</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center shadow-brand flex-shrink-0">
                    <Star className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {INCLUDES.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-neutral-700">{item}</span>
                    </div>
                  ))}
                  <div className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-success-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-success-700">7 días de garantía de satisfacción</span>
                  </div>
                </div>

                <a
                  href="mailto:ventas@restopos.co?subject=Quiero la Oferta Especial RestoPOS"
                  className="btn-primary w-full justify-center text-base py-3.5"
                >
                  Quiero Esta Oferta
                  <ArrowRight className="w-4 h-4" />
                </a>
                <p className="text-center text-xs text-neutral-400 mt-3">
                  Sin contrato • Cancela cuando quieras • Soporte incluido
                </p>
              </div>
            </div>
          </div>

          {/* Savings table */}
          <div className="mt-14 max-w-5xl mx-auto">
            <h3 className="font-display text-2xl font-bold text-neutral-900 text-center mb-6">
              Resumen de tu Ahorro
            </h3>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-100">
                      <th className="px-6 py-4 text-left font-semibold text-neutral-700">Componente del Servicio</th>
                      <th className="px-6 py-4 text-center font-semibold text-neutral-400">Tarifa Regular</th>
                      <th className="px-6 py-4 text-center font-semibold text-brand-600">Oferta Hoy</th>
                      <th className="px-6 py-4 text-center font-semibold text-success-600">Tu Ahorro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {OFFER_TABLE.map((row, i) => (
                      <tr key={row.component} className={`border-b border-neutral-50 ${i % 2 === 0 ? '' : 'bg-neutral-50/40'}`}>
                        <td className="px-6 py-4 text-neutral-700 font-medium">{row.component}</td>
                        <td className="px-6 py-4 text-center text-neutral-400 line-through">{row.regular}</td>
                        <td className="px-6 py-4 text-center">
                          {row.isFree
                            ? <span className="badge bg-success-100 text-success-700">GRATIS</span>
                            : <span className="font-semibold text-brand-600">{row.special}</span>
                          }
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-success-600">{row.saving}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
