import React from 'react';
import { 
  DollarSign, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Receipt, 
  Calendar 
} from 'lucide-react';
import { HeavyRentalBilling } from '../../../modules/heavy-equipment/types';

interface Props {
  billings: HeavyRentalBilling[];
}

export const HeavyRentalBillingTab: React.FC<Props> = ({ billings }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-500" />
            Sewa Rental Alat Berat, Minimum Charge & Penagihan Faktur
          </h3>
          <p className="text-xs text-slate-500">
            Perhitungan sewa Lepas Kunci / All-in Operator BBM, garansi minimum pemakaian jam (100–250 HM/bln), dan biaya mob-demob lowbed.
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Terbitkan Faktur Sewa
        </button>
      </div>

      {/* Invoice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {billings.map((b) => (
          <div 
            key={b.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
                  {b.invoiceNumber}
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white mt-1 text-sm">{b.clientName}</h4>
                <div className="text-xs text-slate-500">{b.projectName}</div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                b.paymentStatus === 'PAID'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
              }`}>
                {b.paymentStatus === 'PAID' ? 'LUNAS (PAID)' : 'MENUNGGU PEMBAYARAN'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Unit Sewa:</span>
                <span className="font-bold text-slate-900 dark:text-white">{b.equipmentCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Skema Rental:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{b.rentalType.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-500">Pemakaian HM:</span>
                <span>{b.totalHMUsed} HM (Min. {b.minimumMonthlyHM} HM)</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-500">Tarif / Jam:</span>
                <span>Rp {b.hourlyRateIdr.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Tagihan (+PPN 11%):</span>
                <span className="font-mono font-black text-slate-900 dark:text-white text-base">
                  Rp {b.totalInvoiceIdr.toLocaleString('id-ID')}
                </span>
              </div>
              <span className="text-xs text-slate-500">Jatuh Tempo: <strong>{b.dueDate}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
