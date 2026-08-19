/**
 * Fleet Intelligence Smart AI - Payment Methods & Billing Settings Tab (Prompt 41)
 * Payment method preferences, billing email notification recipients, NPWP tax details, and auto-renew toggle
 */

import React, { useState } from 'react';
import { useSubscription } from '../../../context/SubscriptionContext';
import { useToast } from '../../../components/ui/Toast';
import {
  CreditCard,
  Building2,
  Mail,
  FileCheck,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export const PaymentSettingsTab: React.FC = () => {
  const { subscription, toggleAutoRenew } = useSubscription();
  const { addToast } = useToast();

  const [billingEmail, setBillingEmail] = useState('finance@translogistik.co.id');
  const [npwpNumber, setNpwpNumber] = useState('01.345.678.9-012.000');
  const [taxCompanyName, setTaxCompanyName] = useState('PT Trans Logistik Nusantara');
  const [taxAddress, setTaxAddress] = useState('Gedung Wisma Telematika Lt. 8, Jakarta Selatan');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveTaxInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast({
        title: 'Pengaturan Billing Disimpan',
        message: 'Informasi perpajakan (NPWP) dan alamat penagihan telah berhasil diperbarui.',
        type: 'success',
      });
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* 1. Auto-Renewal & Payment Preference */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Perpanjangan Langganan Otomatis (Auto-Renew)</h3>
              <p className="text-xs text-slate-500">
                Sistem akan membuat tagihan perpanjangan otomatis 3 hari sebelum siklus masa aktif berakhir.
              </p>
            </div>
          </div>
          <button
            onClick={() => subscription && toggleAutoRenew(!subscription.autoRenew)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              subscription?.autoRenew ? 'bg-cyan-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                subscription?.autoRenew ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Registered Payment Methods */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-cyan-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Metode Pembayaran Tersimpan</h3>
              <p className="text-xs text-slate-500">Metode utama untuk pembayaran tagihan otomatis & manual</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border-2 border-cyan-500/30 bg-cyan-50/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-bold text-xs text-blue-700">
                BCA
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">BCA Virtual Account</span>
                  <span className="px-1.5 py-0.2 bg-cyan-100 text-cyan-800 text-[10px] font-bold rounded">Utama</span>
                </div>
                <div className="text-xs font-mono text-slate-500 mt-0.5">VA: 80777081290348</div>
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-cyan-600" />
          </div>

          <div className="p-4 border border-slate-200 bg-white rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center font-bold text-xs text-slate-700">
                VISA
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900">Corporate Credit Card</span>
                <div className="text-xs font-mono text-slate-500 mt-0.5">•••• •••• •••• 8842 (Exp 08/29)</div>
              </div>
            </div>
            <span className="text-[10px] text-slate-400">Terverifikasi</span>
          </div>
        </div>
      </div>

      {/* 3. Tax & Electronic Invoicing Details (NPWP & PPN 11%) */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-cyan-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Identitas Pajak & Faktur Pajak (NPWP)</h3>
            <p className="text-xs text-slate-500">
              Informasi perpajakan yang dicantumkan pada e-Faktur Pajak PPN 11% resmi Direktorat Jenderal Pajak (DJP)
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveTaxInfo} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Pokok Wajib Pajak (NPWP 16-Digit)</label>
              <input
                type="text"
                value={npwpNumber}
                onChange={(e) => setNpwpNumber(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-mono focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Legal Perusahaan (Sesuai SK Kemenkumham)</label>
              <input
                type="text"
                value={taxCompanyName}
                onChange={(e) => setTaxCompanyName(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Terdaftar Wajib Pajak</label>
            <input
              type="text"
              value={taxAddress}
              onChange={(e) => setTaxAddress(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Penerima Faktur & Invoice Elektronik</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={billingEmail}
                onChange={(e) => setBillingEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Informasi Penagihan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
