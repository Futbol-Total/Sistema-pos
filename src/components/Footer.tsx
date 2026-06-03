import { UtensilsCrossed, Mail, MessageCircle, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400">
      <div className="container-wide section-padding py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                Resto<span className="text-brand-500">POS</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-neutral-500 max-w-xs">
              Sistema POS diseñado para restaurantes colombianos. Control total, soporte real y sin contrato de permanencia.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Navegación</h4>
            <ul className="space-y-2.5 text-sm">
              {['Características', 'Demostración', 'Precios', 'Kit Técnico', 'Preguntas'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Contacto</h4>
            <div className="space-y-3">
              <a href="mailto:ventas@restopos.co" className="flex items-center gap-2.5 text-sm hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-brand-500" />
                ventas@restopos.co
              </a>
              <a href="https://wa.me/573000000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4 text-brand-500" />
                WhatsApp 24/7
              </a>
              <a href="/admin" className="flex items-center gap-2.5 text-sm hover:text-white transition-colors">
                <span className="text-xs px-2 py-1 bg-neutral-700 rounded">Admin</span>
              </a>
              <div className="flex gap-3 pt-2">
                <a href="#" className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-brand-500 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-brand-500 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
          <span>© {new Date().getFullYear()} RestoPOS. Todos los derechos reservados.</span>
          <span>Hecho con orgullo en Colombia</span>
        </div>
      </div>
    </footer>
  );
}
