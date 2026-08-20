import React, { useState, useEffect } from 'react';
import { Truck, Menu, X, ArrowRight, User, ChevronDown, Sparkles, BookOpen, Layers, ShieldCheck, PhoneCall } from 'lucide-react';

interface LandingNavbarProps {
  onNavigateLogin: () => void;
  onRequestDemo?: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onNavigateLogin, onRequestDemo }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

  const featureItems = [
    { title: 'Real-Time GPS Tracking', href: '#features', desc: 'Pelacakan live posisi kendaraan 5 detik' },
    { title: 'Fleet Management', href: '#fleet', desc: 'Master data kendaraan, STNK & KIR' },
    { title: 'Driver Management', href: '#features', desc: 'Profil SIM, penugasan & jam kerja' },
    { title: 'Fuel Management', href: '#fuel', desc: 'Sensor BBM Biosolar & siphoning alert' },
    { title: 'Predictive Maintenance', href: '#maintenance', desc: 'Prediksi kerusakan mesin & work order' },
    { title: 'Geofencing & POI', href: '#features', desc: 'Polygon zona gudang & pelabuhan' },
    { title: 'Route Management', href: '#features', desc: 'Optimasi multi-drop & deviasi rute' },
    { title: 'AI Fleet Analytics', href: '#ai', desc: 'Copilot asisten & prediksi biaya' },
    { title: 'Safety Management', href: '#safety', desc: 'Driver scorecard & fatigue detection' },
    { title: 'Automated Reports', href: '#analytics', desc: 'Ekspor laporan PDF & Excel CPK' },
  ];

  const industryItems = [
    { name: 'Logistics', desc: 'SLA pengiriman & tracking', href: '#industries' },
    { name: 'Expedition', desc: 'Kargo antarpulau & box', href: '#industries' },
    { name: 'Rental', desc: 'Immobilizer & anti-theft', href: '#industries' },
    { name: 'Transportation', desc: 'Muatan berat & HSE', href: '#industries' },
    { name: 'Bus', desc: 'Kecepatan & jadwal trayek', href: '#industries' },
    { name: 'Travel', desc: 'Shuttle antar jemput', href: '#industries' },
    { name: 'Mining', desc: 'Dump truck & alat berat', href: '#industries' },
    { name: 'Plantation', desc: 'Sawit & peta blok', href: '#industries' },
    { name: 'Construction', desc: 'Molen & dump proyek', href: '#industries' },
    { name: 'Distribution', desc: 'FMCG multi-drop POD', href: '#industries' },
    { name: 'Government', desc: 'Mobil dinas & audit BBM', href: '#industries' },
    { name: 'Corporate Fleet', desc: 'Pool car & reimbursement', href: '#industries' },
  ];

  const handleDemoClick = () => {
    if (onRequestDemo) {
      onRequestDemo();
    } else {
      onNavigateLogin();
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-black/40'
          : 'bg-slate-950/70 backdrop-blur-md border-b border-slate-900/50'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-slate-950 shadow-md shadow-cyan-500/20 font-black group-hover:scale-105 transition-transform">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-sm sm:text-base font-black tracking-tight text-white block leading-none">
              FLEET<span className="text-cyan-400">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Fleet Intelligence Smart AI</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-slate-300">
          {/* Product Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('product')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-white hover:bg-slate-900/60 transition-colors">
              <span>Product</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </button>
            {activeDropdown === 'product' && (
              <div className="absolute top-full left-0 w-80 rounded-2xl border border-slate-800 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-xl grid gap-2">
                <a href="#gps" className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-900 transition-colors">
                  <div className="h-7 w-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Truck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Live Telematics Platform</div>
                    <div className="text-[10px] text-slate-400">GPS real-time & IoT Gateway</div>
                  </div>
                </a>
                <a href="#ai" className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-900 transition-colors">
                  <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Smart AI Copilot</div>
                    <div className="text-[10px] text-slate-400">Machine learning anomaly detection</div>
                  </div>
                </a>
                <a href="#fuel" className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-900 transition-colors">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Fuel & Siphoning Radar</div>
                    <div className="text-[10px] text-slate-400">Pencegahan pencurian solar B35</div>
                  </div>
                </a>
              </div>
            )}
          </div>

          {/* Features Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('features')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <a
              href="#features"
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-white hover:bg-slate-900/60 transition-colors"
            >
              <span>Features</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </a>
            {activeDropdown === 'features' && (
              <div className="absolute top-full -left-20 w-[480px] rounded-2xl border border-slate-800 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl grid grid-cols-2 gap-2">
                {featureItems.map((f, idx) => (
                  <a
                    key={idx}
                    href={f.href}
                    className="p-2 rounded-xl hover:bg-slate-900 transition-colors block text-left"
                  >
                    <div className="text-xs font-bold text-white hover:text-cyan-400 transition-colors">{f.title}</div>
                    <div className="text-[10px] text-slate-400 truncate">{f.desc}</div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Solutions / Industries Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('solutions')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <a
              href="#industries"
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-white hover:bg-slate-900/60 transition-colors"
            >
              <span>Solutions & Industries</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </a>
            {activeDropdown === 'solutions' && (
              <div className="absolute top-full -left-24 w-[540px] rounded-2xl border border-slate-800 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl grid grid-cols-3 gap-2">
                {industryItems.map((ind, idx) => (
                  <a
                    key={idx}
                    href={ind.href}
                    className="p-2 rounded-xl hover:bg-slate-900 transition-colors block text-left"
                  >
                    <div className="text-xs font-bold text-white hover:text-cyan-400 transition-colors">{ind.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{ind.desc}</div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Pricing */}
          <a
            href="#pricing"
            className="px-3 py-2 rounded-lg hover:text-cyan-400 hover:bg-slate-900/60 transition-colors"
          >
            Pricing
          </a>

          {/* Documentation */}
          <a
            href="#faq"
            className="px-3 py-2 rounded-lg hover:text-cyan-400 hover:bg-slate-900/60 transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="h-3.5 w-3.5 opacity-70" />
            <span>Documentation</span>
          </a>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onNavigateLogin}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-slate-700 hover:text-white transition-all"
          >
            <User className="h-3.5 w-3.5 text-cyan-400" />
            <span>Login</span>
          </button>

          <button
            onClick={handleDemoClick}
            className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20 hover:scale-[1.02]"
          >
            <span>Request Demo</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Trigger */}
        <button
          onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileDrawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileDrawerOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/95 px-4 py-5 backdrop-blur-xl space-y-4">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-300">
            <a
              href="#features"
              onClick={() => setIsMobileDrawerOpen(false)}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30"
            >
              Product Features
            </a>
            <a
              href="#industries"
              onClick={() => setIsMobileDrawerOpen(false)}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30"
            >
              Industry Solutions
            </a>
            <a
              href="#pricing"
              onClick={() => setIsMobileDrawerOpen(false)}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30"
            >
              Pricing Plans
            </a>
            <a
              href="#faq"
              onClick={() => setIsMobileDrawerOpen(false)}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30"
            >
              Documentation & FAQ
            </a>
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsMobileDrawerOpen(false);
                handleDemoClick();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-xs font-bold text-slate-950"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Request Demo Gratis</span>
            </button>

            <button
              onClick={() => {
                setIsMobileDrawerOpen(false);
                onNavigateLogin();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 py-2.5 text-xs font-semibold text-white"
            >
              <User className="h-4 w-4 text-cyan-400" />
              <span>Login ke Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
