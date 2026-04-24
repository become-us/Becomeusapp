import React, { useState, useEffect } from 'react';
import { NAV_LINKS } from '@/lib/constants';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/images/becomeus_logo.png"
            alt="BecomeUs"
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
            Se connecter
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-all shadow-sm"
          >
            Essayer gratuitement
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-border px-6 pb-4">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="block w-full text-left py-3 text-sm font-medium text-muted-foreground hover:text-foreground border-b border-border/50 last:border-0"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollToSection('pricing')}
            className="mt-4 w-full bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-full"
          >
            Essayer gratuitement
          </button>
        </div>
      )}
    </header>
  );
}
