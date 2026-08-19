/**
 * Fleet Intelligence Smart AI - Invoices & Billing History Tab (Prompt 41)
 * Searchable invoice ledger, status badges, itemized modal, and PDF receipt/tax invoice print simulator
 */

import React, { useState } from 'react';
import { Invoice } from '../../../types/subscription';
import { useSubscription } from '../../../context/SubscriptionContext';
import {
  FileText,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Building2,
  Printer,
  X,
  CreditCard,
} from 'lucide-react';

export const InvoicesHistoryTab: React.FC = () => {
  const { invoices } = useSubscription();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.tenantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nomor invoice / transaksi..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-cyan-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 text-slate-700 bg-white"
          >
            <option value="ALL">Semua Status</option>
            <option value="PAID">Lunas (PAID)</option>
            <option value="PENDING">Menunggu Pembayaran</option>
            <option value="FAILED">Gagal (FAILED)</option>
          </select>
        </div>
      </div>

      {/* Invoice Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                <th className="py-3 px-4">Nomor Faktur</th>
                <th className="py-3 px-4">Tanggal Terbit</th>
                <th className="py-3 px-4">Periode Layanan</th>
                <th className="py-3 px-4">Metode Bayar</th>
                <th className="py-3 px-4 text-right">Total Nominal</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    Tidak ada riwayat invoice yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {new Date(inv.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {new Date(inv.periodStart).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })} -{' '}
                      {new Date(inv.periodEnd).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="px-2 py-0.5 bg-slate-100 rounded-md font-mono text-[11px]">
                        {inv.paymentMethod ? inv.paymentMethod.replace('_', ' ') : 'TRANSFER'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      Rp {inv.totalAmount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {inv.status === 'PAID' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {inv.status === 'PENDING' && <Clock className="w-3 h-3 text-amber-600" />}
                        {inv.status === 'FAILED' && <AlertCircle className="w-3 h-3 text-rose-600" />}
                        <span>{inv.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        title="Lihat Faktur"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Rincian</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail / Print Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 p-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-cyan-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                  FI
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Fleet Intelligence Smart AI</h3>
                  <p className="text-[11px] text-slate-500">PT Fleet Intelligence Nusantara</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak PDF</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 my-6 text-xs">
              <div>
                <span className="text-slate-500 font-semibold">DITAGIHKAN KEPADA:</span>
                <div className="font-bold text-slate-900 mt-1">{selectedInvoice.tenantName}</div>
                <div className="text-slate-600 mt-0.5">NPWP: 01.345.678.9-012.000</div>
                <div className="text-slate-600">Gedung Wisma Telematika Lt. 8, Jakarta</div>
              </div>
              <div className="text-right">
                <span className="text-slate-500 font-semibold">FAKTUR TAGIHAN RESMI:</span>
                <div className="font-mono font-bold text-base text-slate-900 mt-1">{selectedInvoice.invoiceNumber}</div>
                <div className="text-slate-600 mt-0.5">
                  Tanggal: {new Date(selectedInvoice.createdAt).toLocaleDateString('id-ID')}
                </div>
                <div className="text-slate-600">
                  Status:{' '}
                  <strong className={selectedInvoice.status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}>
                    {selectedInvoice.status}
                  </strong>
                </div>
              </div>
            </div>

            {/* Line items */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Deskripsi Item Layanan</th>
                    <th className="py-2.5 px-3 text-center">Jumlah</th>
                    <th className="py-2.5 px-3 text-right">Harga Satuan</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 px-3 font-medium text-slate-900">{item.description}</td>
                      <td className="py-3 px-3 text-center text-slate-600">{item.quantity}</td>
                      <td className="py-3 px-3 text-right font-mono">Rp {item.unitPrice.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold">Rp {item.amount.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 text-xs max-w-xs ml-auto text-slate-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">Rp {selectedInvoice.amount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>PPN 11%</span>
                <span className="font-mono">Rp {selectedInvoice.taxAmount.toLocaleString('id-ID')}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Bayar</span>
                <span className="font-mono text-cyan-700">Rp {selectedInvoice.totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-4 flex items-center justify-between">
              <span>Dokumen ini sah dan diterbitkan secara elektronik oleh sistem SaaS Fleet Intelligence.</span>
              <span className="font-mono">{selectedInvoice.paymentReference || 'VERIFIED'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
