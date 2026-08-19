import React, { useState, useEffect } from 'react';
import { Truck, Menu, X, ArrowRight, User } from 'lucide-react';

interface LandingNavbarProps {
  onNavigateLogin: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onNavigateLogin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Fitur Utama', href: '#features' },
    { label: 'Live GPS', href: '#gps' },
    { label: 'Smart AI', href: '#ai' },
    { label: 'Industri', href: '#industries' },
    { label: 'Harga', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-black/40'
          : 'bg-slate-950/60 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-slate-950 shadow-md shadow-cyan-500/20 font-black">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-sm sm:text-base font-black tracking-tight text-white block leading-none">
              FLEET<span className="text-cyan-400">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Fleet Intelligence Smart AI</span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-cyan-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onNavigateLogin}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-slate-700 hover:text-white transition-all"
          >
            <User className="h-3.5 w-3.5 text-cyan-400" />
            <span>Login</span>
          </button>

          <button
            onClick={onNavigateLogin}
            className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20 hover:scale-[1.02]"
          >
            <span>Mulai Sekarang</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Trigger */}
        <button
          onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileDrawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileDrawerOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur-xl space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileDrawerOpen(false)}
                className="rounded-lg p-2 hover:bg-slate-900 hover:text-cyan-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsMobileDrawerOpen(false);
                onNavigateLogin();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 py-2.5 text-xs font-semibold text-white"
            >
              <User className="h-4 w-4 text-cyan-400" />
              <span>Login Perusahaan</span>
            </button>

            <button
              onClick={() => {
                setIsMobileDrawerOpen(false);
                onNavigateLogin();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20"
            >
              <span>Mulai Sekarang</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
