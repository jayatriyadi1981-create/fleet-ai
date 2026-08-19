import React from 'react';
import { Truck, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        {/* Brand Info */}
        <div className="col-span-2 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-black">
              <Truck className="h-4 w-4" />
            </div>
            <span className="text-sm font-black text-white tracking-tight">
              FLEET<span className="text-cyan-400">AI</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            Platform Fleet Management berbasis GPS dan Smart AI untuk memantau kendaraan, mengoptimalkan BBM, memprediksi maintenance, dan membantu bisnis armada bergerak lebih efisien di Indonesia.
          </p>
          <div className="pt-2 text-[11px] text-slate-500 space-y-1">
            <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-cyan-400" /> Jakarta & Surabaya, Indonesia</p>
            <p className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-cyan-400" /> support@fleetintelligence.ai</p>
          </div>
        </div>

        {/* Product Links */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Produk & Solusi</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#gps" className="hover:text-cyan-400 transition-colors">Live GPS Tracking</a></li>
            <li><a href="#ai" className="hover:text-cyan-400 transition-colors">Smart AI Intelligence</a></li>
            <li><a href="#features" className="hover:text-cyan-400 transition-colors">Driver Safety Scorecard</a></li>
            <li><a href="#features" className="hover:text-cyan-400 transition-colors">Fuel Management B35</a></li>
            <li><a href="#features" className="hover:text-cyan-400 transition-colors">Predictive Maintenance</a></li>
            <li><a href="#pricing" className="hover:text-cyan-400 transition-colors">Harga & Paket</a></li>
          </ul>
        </div>

        {/* Industries */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Industri</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#industries" className="hover:text-cyan-400 transition-colors">Logistik & Ekspedisi</a></li>
            <li><a href="#industries" className="hover:text-cyan-400 transition-colors">Transportasi & Cargo</a></li>
            <li><a href="#industries" className="hover:text-cyan-400 transition-colors">Rental & Leasing</a></li>
            <li><a href="#industries" className="hover:text-cyan-400 transition-colors">Tambang & Alat Berat</a></li>
            <li><a href="#industries" className="hover:text-cyan-400 transition-colors">FMCG & Distribusi</a></li>
          </ul>
        </div>

        {/* Legal & Help */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Dukungan & Legal</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ & Bantuan</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Kebijakan Privasi Data GPS</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Ketentuan Layanan</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Integrasi API & Webhook</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Status Sistem 99.9%</a></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <p>© 2026 Fleet Intelligence Smart AI. All rights reserved.</p>
        <p className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Keamanan Data & Privasi Terjamin</span>
        </p>
      </div>
    </footer>
  );
};
