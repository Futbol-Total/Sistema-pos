import { useState } from 'react';
import { ChevronDown, Wifi, FileX, Headphones, Clock } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const FAQS = [
  {
    icon: Wifi,
    question: '¿Qué pasa si se cae el internet en pleno servicio?',
    answer:
      'El sistema trabaja con base de datos local híbrida. Si el internet de Claro, Movistar o Tigo falla, el restaurante sigue operando exactamente igual: toma de pedidos, impresión de comandas y cierre de cuentas sin ninguna interrupción. Al volver la conexión, el sistema sincroniza todas las ventas a la nube de manera automática en segundo plano.',
  },
  {
    icon: FileX,
    question: '¿Hay contrato de permanencia o multas por cancelar?',
    answer:
      'No hay ningún contrato de permanencia. El modelo de suscripción está diseñado para premiar el buen servicio — si el servicio no cumple, no debe haber razón para quedar atrapado. Si el restaurante cierra o decides no continuar, solo avisas con 15 días de anticipación y el servicio se suspende sin multas ni cláusulas.',
  },
  {
    icon: Headphones,
    question: '¿El soporte técnico tiene costo adicional?',
    answer:
      'No, el soporte técnico está completamente incluido en los $195.000 COP mensuales. Incluye una línea de atención prioritaria para emergencias los fines de semana, que son precisamente los días de mayor venta para la mayoría de restaurantes. No hay cobros adicionales por llamadas, visitas de configuración o actualizaciones.',
  },
  {
    icon: Clock,
    question: '¿Cuánto tarda la implementación inicial?',
    answer:
      'El proceso completo de implementación toma entre 3 y 5 días hábiles. Incluye: diseño del mapa de mesas personalizado, carga de hasta 150 productos con fotos de alta calidad, configuración de impresoras y comanderas, y 2 jornadas de capacitación al personal. Al terminar, tu equipo ya opera con el sistema con confianza.',
  },
];

function FAQItem({ faq, defaultOpen = false }: { faq: typeof FAQS[0]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
        open ? 'border-brand-200 shadow-card' : 'border-neutral-100 hover:border-neutral-200'
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-6 text-left bg-white"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
          open ? 'bg-brand-50 text-brand-600' : 'bg-neutral-100 text-neutral-500'
        }`}>
          <faq.icon className="w-5 h-5" />
        </div>
        <span className={`flex-1 font-semibold text-base ${open ? 'text-neutral-900' : 'text-neutral-700'}`}>
          {faq.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
            open ? 'rotate-180 text-brand-500' : 'text-neutral-400'
          }`}
        />
      </button>
      {open && (
        <div className="px-6 pb-6 pt-0 bg-white">
          <div className="pl-14">
            <p className="text-neutral-500 leading-relaxed">{faq.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const { ref, inView } = useInView();

  return (
    <section id="faq" className="py-24 bg-slate-50" ref={ref}>
      <div className="container-narrow section-padding" ref={ref}>
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="badge bg-neutral-200 text-neutral-600 mb-4">Preguntas Frecuentes</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-4 text-balance">
            Resuelve tus dudas
          </h2>
          <p className="text-lg text-neutral-500">
            Las objeciones más comunes, respondidas con honestidad.
          </p>
        </div>

        <div className={`space-y-3 transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {FAQS.map((faq, i) => (
            <FAQItem key={faq.question} faq={faq} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
