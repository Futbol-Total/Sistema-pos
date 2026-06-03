import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Features from './components/Features';
import DemoScript from './components/DemoScript';
import Pricing from './components/Pricing';
import TechKit from './components/TechKit';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';
import POSDemo from './components/POSDemo';
import AdminDashboard from './components/AdminDashboard';
import InvoicesPage from './components/InvoicesPage';
import ReportsPage from './components/ReportsPage';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'demo' | 'admin' | 'invoices' | 'reports'>('home');

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/demo' || path === '/pos') {
      setCurrentView('demo');
    } else if (path === '/admin') {
      setCurrentView('admin');
    } else if (path === '/invoices') {
      setCurrentView('invoices');
    } else if (path === '/reports') {
      setCurrentView('reports');
    } else {
      setCurrentView('home');
    }
  }, []);

  useEffect(() => {
    const handleNavigation = (e: PopStateEvent) => {
      const path = window.location.pathname;
      if (path === '/demo' || path === '/pos') {
        setCurrentView('demo');
      } else if (path === '/admin') {
        setCurrentView('admin');
      } else if (path === '/invoices') {
        setCurrentView('invoices');
      } else if (path === '/reports') {
        setCurrentView('reports');
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  if (currentView === 'demo') {
    return <POSDemo />;
  }

  if (currentView === 'admin') {
    return <AdminDashboard />;
  }

  if (currentView === 'invoices') {
    return <InvoicesPage />;
  }

  if (currentView === 'reports') {
    return <ReportsPage />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <DemoScript />
      <Pricing />
      <TechKit />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
