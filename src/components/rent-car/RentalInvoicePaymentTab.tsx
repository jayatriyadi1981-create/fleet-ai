import React, { useState } from 'react';
import { RentalInvoice } from '../../modules/rent-car/types';
import { rentCarService } from '../../modules/rent-car/services/rentCarService';
import { 
  FileSpreadsheet, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  Printer, 
  Search, 
  CreditCard, 
  Building2, 
  Receipt,
  FileCheck,
  Check
} from 'lucide-react';

interface RentalInvoicePaymentTabProps {
  invoices: RentalInvoice[];
  onRefresh: () => void;
}

export const RentalInvoicePaymentTab: React.FC<RentalInvoicePaymentTabProps> = ({ invoices, onRefresh }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<RentalInvoice | null>(invoices[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSettling, setIsSettling] = useState(false);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSettle = (method: RentalInvoice['paymentMethod']) => {
    if (!selectedInvoice) return;
    setIsSettling(true);
    setTimeout(() => {
      rentCarService.settleInvoice(selectedInvoice.id, selectedInvoice.balanceDue, method);
      onRefresh();
      const updated = rentCarService.getInvoiceById(selectedInvoice.id);
      if (updated) setSelectedInvoice(updated);
      setIsSettling(false);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Invoice List */}
      <div className="lg:col-span-5 space-y-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Faktur Tagihan & Invoicing
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              {filteredInvoices.length} Faktur
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nomor invoice, penyewa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-2.5 py-2 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Semua</option>
              <option value="paid">Lunas</option>
              <option value="partial">Sebagian (DP)</option>
              <option value="unpaid">Belum Dibayar</option>
            </select>
          </div>
        </div>

        <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
          {filteredInvoices.map((inv) => {
            const isSelected = selectedInvoice?.id === inv.id;
            return (
              <div
                key={inv.id}
                onClick={() => setSelectedInvoice(inv)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500 shadow-lg shadow-cyan-950/20'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {inv.invoiceNumber}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        inv.paymentStatus === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : inv.paymentStatus === 'partial'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {inv.paymentStatus}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white mt-1">
                      {inv.customerName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      Rp {inv.grandTotal.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Sisa: Rp {inv.balanceDue.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <span className="font-mono text-slate-300">{inv.vehiclePlate}</span>
                  <span>Jatuh Tempo: {inv.dueDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice Detail Sheet */}
      <div className="lg:col-span-7">
        {selectedInvoice ? (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Official Tax Rental Invoice
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    PPN 11% COMPLIANT
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Nomor: {selectedInvoice.invoiceNumber} | Terbit: {selectedInvoice.issuedDate}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak</span>
                </button>
              </div>
            </div>

            {/* Billing Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ditagihkan Kepada:</span>
                <p className="text-xs font-bold text-white">{selectedInvoice.customerName}</p>
                <p className="text-[11px] text-slate-400">{selectedInvoice.customerAddress}</p>
                <p className="text-[11px] text-slate-400 font-mono">Telp: {selectedInvoice.customerPhone}</p>
                {selectedInvoice.customerNpwp && (
                  <p className="text-[10px] font-mono text-cyan-400">NPWP: {selectedInvoice.customerNpwp}</p>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ringkasan Masa Sewa:</span>
                <p className="text-xs font-bold text-white">{selectedInvoice.rentalPeriod}</p>
                <p className="text-[11px] text-slate-400">Armada: {selectedInvoice.vehicleModel}</p>
                <p className="text-[11px] font-mono text-cyan-400 font-bold">{selectedInvoice.vehiclePlate}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-hidden rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Deskripsi Layanan / Item</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Tarif Satuan</th>
                    <th className="p-3 text-right">Jumlah (IDR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                  {selectedInvoice.lineItems.map((item) => (
                    <tr key={item.id}>
                      <td className="p-3 font-medium text-white">{item.description}</td>
                      <td className="p-3 text-center text-slate-400">{item.quantity} {item.unit}</td>
                      <td className="p-3 text-right font-mono text-slate-300">Rp {item.unitPrice.toLocaleString('id-ID')}</td>
                      <td className="p-3 text-right font-mono font-bold text-white">Rp {item.totalPrice.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Totals */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal Layanan:</span>
                <span className="font-mono text-white">Rp {selectedInvoice.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>PPN 11%:</span>
                <span className="font-mono text-white">Rp {selectedInvoice.ppn11Amount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Jaminan Deposit Escrow (Ditahan):</span>
                <span className="font-mono text-amber-400">Rp {selectedInvoice.depositApplied.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span className="text-cyan-400">Grand Total Faktur:</span>
                <span className="font-mono text-emerald-400">Rp {selectedInvoice.grandTotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 pt-1">
                <span>Telah Dibayar:</span>
                <span className="font-mono text-emerald-400">Rp {selectedInvoice.totalPaid.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-rose-400">
                <span>Sisa Tagihan (Balance Due):</span>
                <span className="font-mono">Rp {selectedInvoice.balanceDue.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Settle Action */}
            {selectedInvoice.balanceDue > 0 && (
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-cyan-300 block">Pelunasan Tagihan Instan</span>
                  <span className="text-[11px] text-slate-400">Pilih metode pembayaran untuk mencatat penyelesaian invoice.</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={isSettling}
                    onClick={() => handleSettle('qris')}
                    className="px-3 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-all flex items-center gap-1.5 shadow-lg"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Lunas QRIS / VA</span>
                  </button>
                  <button
                    disabled={isSettling}
                    onClick={() => handleSettle('corporate_term')}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    <span>Corporate TOP</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-400">
            <Receipt className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <p className="text-sm font-semibold">Pilih salah satu faktur untuk melihat detail billing & line items.</p>
          </div>
        )}
      </div>
    </div>
  );
};
