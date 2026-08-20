import React, { useState } from 'react';
import { X, CheckCircle2, Truck, Calendar, Building, Mail, Phone, User, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface RequestDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateLogin?: () => void;
}

export const RequestDemoModal: React.FC<RequestDemoModalProps> = ({ isOpen, onClose, onNavigateLogin }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    workEmail: '',
    phoneNumber: '',
    fleetSize: '11-50',
    industry: 'Logistics',
    preferredDate: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
    }, 800);
  };

  const industriesList = [
    'Logistics & Ekspedisi',
    'Expedition & Cargo',
    'Rental Mobil & Leasing',
    'Transportation & Logistik Khusus',
    'Bus Antarkota & Pariwisata',
    'Travel Shuttle & Jemputan',
    'Mining (Pertambangan)',
    'Plantation (Perkebunan / Sawit)',
    'Construction (Kontraktor & Molen)',
    'Distribution & FMCG Retail',
    'Government & Instansi Negara',
    'Corporate Fleet Operasional',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl z-10 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {step === 'form' ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 mb-0.5">
                  <Sparkles className="h-3 w-3" />
                  <span>Jadwalkan Live Demo 1-on-1</span>
                </div>
                <h3 className="text-xl font-black text-white">Request Demo Platform Fleet AI</h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Konsultasikan kebutuhan armada Anda bersama Fleet Telematics Specialist kami. Dapatkan live preview dashboard khusus untuk industri Anda beserta simulasi ROI penghematan solar.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Contoh: Budi Pratama"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Perusahaan *</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="PT Logistik Nusantara"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Kantor *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={formData.workEmail}
                      onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                      placeholder="budi@perusahaan.com"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">No. WhatsApp / Telepon *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="0812-3456-7890"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Jumlah Armada Kendaraan</label>
                  <select
                    value={formData.fleetSize}
                    onChange={(e) => setFormData({ ...formData, fleetSize: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="1-10">1 - 10 Unit (Armada Kecil)</option>
                    <option value="11-50">11 - 50 Unit (Menengah)</option>
                    <option value="51-200">51 - 200 Unit (Besar / Enterprise)</option>
                    <option value="200+">200+ Unit (Korporasi Multi-Cabang)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sektor Industri</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    {industriesList.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Pilihan Jadwal / Preferensi Waktu Demo</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Memproses Permintaan...</span>
                  ) : (
                    <>
                      <span>Kirim Permintaan Demo</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 text-center">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Privasi data terjaga. Kami tidak membagikan data kontak Anda kepada pihak ketiga.</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black text-white">Permintaan Demo Terkirim!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Terima kasih <strong className="text-white">{formData.fullName}</strong> dari <strong className="text-white">{formData.companyName}</strong>. Tim Telematika kami akan menghubungi WhatsApp Anda dalam 15-30 menit untuk mengonfirmasi sesi live demo.
            </p>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-left text-xs space-y-2 text-slate-400">
              <div className="flex justify-between">
                <span>Armada Target:</span>
                <span className="font-semibold text-white">{formData.fleetSize} Unit</span>
              </div>
              <div className="flex justify-between">
                <span>Sektor Industri:</span>
                <span className="font-semibold text-white">{formData.industry}</span>
              </div>
              <div className="flex justify-between">
                <span>Email Terdaftar:</span>
                <span className="font-semibold text-cyan-400">{formData.workEmail}</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="rounded-xl border border-slate-800 bg-slate-950 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-900"
              >
                Tutup
              </button>
              {onNavigateLogin && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateLogin();
                  }}
                  className="rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20"
                >
                  Coba Langsung di Sandbox Portal
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
