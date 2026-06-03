import { useState, useEffect } from 'react';
import { Menu, X, UtensilsCrossed } from 'lucide-react';

const NAV_LINKS = [
  { href: '#caracteristicas', label: 'Características' },
  { href: '#demo', label: 'Demostración' },
  { href: '#precios', label: 'Precios' },
  { href: '#kit-tecnico', label: 'Kit Técnico' },
  { href: '#faq', label: 'Preguntas' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-100'
          : 'bg-transparent'
      }`}
    >
      <div className="container-wide section-padding">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center shadow-brand group-hover:shadow-brand-lg transition-shadow duration-200">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className={`font-bold text-lg tracking-tight transition-colors duration-300 ${scrolled ? 'text-neutral-900' : 'text-white'}`}>
              Resto<span className="text-brand-500">POS</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-brand-50 hover:text-brand-600 ${
                  scrolled ? 'text-neutral-600' : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#precios"
              className="ml-3 btn-primary text-sm py-2.5 px-5"
            >
              Empezar Ahora
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-neutral-700 hover:bg-neutral-100' : 'text-white hover:bg-white/10'}`}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-white border-b border-neutral-100 shadow-lg py-3 px-4 animate-fade-in">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-3 rounded-lg text-sm font-medium text-neutral-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 pb-1">
              <a href="#precios" onClick={() => setOpen(false)} className="btn-primary w-full justify-center">
                Empezar Ahora
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
