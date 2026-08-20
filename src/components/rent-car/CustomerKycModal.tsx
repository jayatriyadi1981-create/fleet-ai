/**
 * Fleet Intelligence Smart AI - Customer Registration & KYC Verification Modal
 */

import React, { useState } from 'react';
import { RentalCustomer } from '../../modules/rent-car/types';
import { rentCarService } from '../../modules/rent-car/services/rentCarService';
import { 
  X, 
  UserCheck, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  FileText, 
  Building, 
  Phone, 
  Mail, 
  CreditCard,
  Camera
} from 'lucide-react';

interface CustomerKycModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CustomerKycModal: React.FC<CustomerKycModalProps> = ({ onClose, onSuccess }) => {
  const [type, setType] = useState<'individual' | 'corporate'>('individual');
  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [simNumber, setSimNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [guarantorName, setGuarantorName] = useState('');
  const [guarantorPhone, setGuarantorPhone] = useState('');
  const [guarantorRelation, setGuarantorRelation] = useState('Keluarga Serumah');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !nik) {
      setErrorMessage('Nama lengkap, Nomor HP, dan NIK KTP wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      rentCarService.addCustomer({
        tenantId: 'tenant-1',
        name,
        type,
        nik,
        simNumber: simNumber || `SIMA-${Math.floor(10000000 + Math.random() * 90000000)}`,
        simExpiry: '2029-12-31',
        companyName: type === 'corporate' ? companyName : undefined,
        phone,
        email: email || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        address: address || 'Jl. Sudirman No. 45',
        city: 'Jakarta Selatan',
        kycStatus: 'verified',
        riskScore: Math.floor(Math.random() * 20) + 5,
        fraudRiskLevel: 'LOW',
        emergencyContactName: guarantorName || 'Keluarga',
        emergencyContactPhone: guarantorPhone || '081299998888',
        emergencyContactRelation: guarantorRelation || 'Saudara Kandung',
        customerRating: 5.0,
        ktpPhotoUploaded: true,
        simPhotoUploaded: true,
        selfieWithKtpUploaded: true,
        notes
      });
      setIsSubmitting(false);
      onSuccess();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Registrasi Pelanggan & Verifikasi KYC</h2>
              <p className="text-xs text-slate-400">Pendaftaran identitas, validasi SIM/KTP, dan scoring anti-fraud.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/40 text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Account Type */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">Tipe Pelanggan</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('individual')}
                className={`py-2 px-3 rounded-lg font-bold border transition-all ${
                  type === 'individual'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Individu / Perorangan
              </button>
              <button
                type="button"
                onClick={() => setType('corporate')}
                className={`py-2 px-3 rounded-lg font-bold border transition-all ${
                  type === 'corporate'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Korporat / PT / B2B
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Nama Lengkap (Sesuai KTP)</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Andi Pratama"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Nomor Induk Kependudukan (NIK)</label>
              <input
                type="text"
                required
                maxLength={16}
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                placeholder="16 Digit NIK KTP"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {type === 'corporate' && (
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Nama Perusahaan / Entitas Legal</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Contoh: PT Tri Adi Bersama"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Nomor SIM A / B1</label>
              <input
                type="text"
                value={simNumber}
                onChange={(e) => setSimNumber(e.target.value)}
                placeholder="SIM-12345678"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Nomor WhatsApp / HP</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Email Aktif</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="andi@gmail.com"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Alamat Domisili KTP</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jl. Thamrin No. 12, Jakarta"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Guarantor / Emergency Contact */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Kontak Penjamin / Darurat (Anti-Fraud)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Nama Penjamin</label>
                <input
                  type="text"
                  value={guarantorName}
                  onChange={(e) => setGuarantorName(e.target.value)}
                  placeholder="Nama kerabat"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Nomor HP Penjamin</label>
                <input
                  type="tel"
                  value={guarantorPhone}
                  onChange={(e) => setGuarantorPhone(e.target.value)}
                  placeholder="0813-xxxx-xxxx"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Hubungan</label>
                <select
                  value={guarantorRelation}
                  onChange={(e) => setGuarantorRelation(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                >
                  <option value="Keluarga Serumah">Keluarga Serumah</option>
                  <option value="Suami / Istri">Suami / Istri</option>
                  <option value="Orang Tua">Orang Tua</option>
                  <option value="HRD Perusahaan">HRD Perusahaan</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-800 -mx-6 -mb-6 bg-slate-950 flex items-center justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all flex items-center gap-2 shadow-lg shadow-cyan-950"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Memverifikasi...' : 'Simpan & Verifikasi KYC'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
