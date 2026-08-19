/**
 * Fleet Intelligence Smart AI - Customers Management Modal
 */

import React, { useState } from 'react';
import { Customer, CustomerAddress, CustomerType } from '../deliveryTypes';
import { customerService } from '../services/customerService';
import {
  X,
  Users,
  Building2,
  Phone,
  Mail,
  MapPin,
  Plus,
  CheckCircle,
  Briefcase,
} from 'lucide-react';

interface CustomersTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerUpdated?: () => void;
}

export const CustomersTableModal: React.FC<CustomersTableModalProps> = ({
  isOpen,
  onClose,
  onCustomerUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [customers, setCustomers] = useState<Customer[]>(() => customerService.getCustomers());

  // New Customer Form State
  const [companyName, setCompanyName] = useState('');
  const [customerCode, setCustomerCode] = useState(`CUST-NEW-${Math.floor(Math.random() * 900 + 100)}`);
  const [customerType, setCustomerType] = useState<CustomerType>('CORPORATE');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();

    const newAddr: CustomerAddress = {
      id: `caddr-${Date.now().toString(36)}`,
      customerId: 'pending',
      label: 'Kantor Pusat / Gudang Utama',
      address,
      latitude: -6.2,
      longitude: 106.8,
      contactName,
      contactPhone: phone,
      isPrimary: true,
    };

    customerService.createCustomer({
      tenantId: 'tenant-tln-01',
      customerCode,
      customerType,
      companyName,
      contactName,
      phone,
      email,
      address,
      latitude: -6.2,
      longitude: 106.8,
      status: 'ACTIVE',
      addresses: [newAddr],
      contacts: [
        {
          id: `ccont-${Date.now().toString(36)}`,
          customerId: 'pending',
          name: contactName,
          role: 'Contact Person',
          phone,
          email,
          isPrimary: true,
        },
      ],
      notes,
    });

    setCustomers(customerService.getCustomers());
    setActiveTab('list');
    onCustomerUpdated?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Master Data Pelanggan & Alamat Kargo</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Basis data perusahaan penerima kargo, kontak penanggung jawab, dan multi-lokasi gudang.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Header */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800 bg-slate-900/80">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'list'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800/60 text-slate-400 hover:text-white'
            }`}
          >
            Daftar Pelanggan ({customers.length})
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'create'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800/60 text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            + Register Pelanggan Baru
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'list' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customers.map((cust) => (
                <div
                  key={cust.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {cust.customerCode}
                      </span>
                      <h3 className="font-bold text-sm text-white mt-1">{cust.companyName}</h3>
                    </div>
                    <span className="text-[10px] uppercase font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {cust.customerType}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                      <span>PIC: <strong>{cust.contactName}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{cust.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-400">{cust.email}</span>
                    </div>

                    <div className="flex items-start gap-2 pt-1 border-t border-slate-800/60">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span className="text-[11px] text-slate-400 leading-relaxed">{cust.address}</span>
                    </div>
                  </div>

                  {/* Multi-address badges */}
                  {cust.addresses && cust.addresses.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/40 text-[10px] text-slate-400 flex flex-wrap gap-1">
                      <span className="font-semibold text-slate-500">Lokasi Gudang:</span>
                      {cust.addresses.map((addr) => (
                        <span key={addr.id} className="bg-slate-900 px-2 py-0.5 rounded text-slate-300">
                          {addr.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Nama Perusahaan *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="PT Indofood / CV Sumber Makmur"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Kode Pelanggan</label>
                  <input
                    type="text"
                    required
                    value={customerCode}
                    onChange={(e) => setCustomerCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-200 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Tipe Pelanggan</label>
                  <select
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value as CustomerType)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-200 outline-none"
                  >
                    <option value="CORPORATE" className="bg-slate-900">Corporate Enterprise</option>
                    <option value="DISTRIBUTOR" className="bg-slate-900">Distributor / Wholesale</option>
                    <option value="RETAIL" className="bg-slate-900">Retail Store / Toko</option>
                    <option value="WAREHOUSE" className="bg-slate-900">Gudang Kargo Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Nama Penanggung Jawab (PIC) *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Budi Setiawan"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Nomor Telepon / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812-3456-7890"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pic@company.com"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Alamat Utama Gudang / Penerima *</label>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Kawasan Industri Jababeka V Blok C-12, Cikarang"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-slate-200 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Catatan Khusus Pengiriman / SLA</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Waktu bongkar muat maks 45 menit..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-200 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/30"
                >
                  <CheckCircle className="w-4 h-4" />
                  Simpan Pelanggan Baru
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
