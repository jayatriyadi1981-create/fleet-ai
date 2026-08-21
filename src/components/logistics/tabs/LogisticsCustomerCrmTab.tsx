import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  TrendingUp, 
  CreditCard, 
  Package, 
  FileText, 
  CheckCircle2,
  Mail,
  Phone
} from 'lucide-react';
import { LogisticsOrder } from '../../../modules/logistics/types';

interface Props {
  orders: LogisticsOrder[];
}

export const LogisticsCustomerCrmTab: React.FC<Props> = ({ orders }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const shippers = [
    {
      id: 'shp-01',
      companyName: 'PT Mega Distribusi Farmasi',
      picName: 'Hendra Gunawan',
      email: 'logistics@megafarma.co.id',
      phone: '+62 811-9876-5432',
      tier: 'ENTERPRISE_VIP',
      creditTerm: 'TOP 30 Hari',
      monthlyVolume: '24,500 Koli',
      contractEndDate: '2026-12-31',
      totalSpendYtd: 485000000,
      activeShipments: 14
    },
    {
      id: 'shp-02',
      companyName: 'CV Sumber Rezeki Otomotif',
      picName: 'Bambang Sudiro',
      email: 'bambang@sumberrezeki.com',
      phone: '+62 812-4455-6677',
      tier: 'CORPORATE_GOLD',
      creditTerm: 'TOP 14 Hari',
      monthlyVolume: '8,200 Koli',
      contractEndDate: '2026-09-30',
      totalSpendYtd: 172000000,
      activeShipments: 6
    },
    {
      id: 'shp-03',
      companyName: 'PT Nusantara Fresh Coldstore',
      picName: 'Siti Rahmawati',
      email: 'ops@nusantarafresh.id',
      phone: '+62 813-2211-9988',
      tier: 'ENTERPRISE_VIP',
      creditTerm: 'TOP 45 Hari',
      monthlyVolume: '15,000 Koli',
      contractEndDate: '2027-03-15',
      totalSpendYtd: 310000000,
      activeShipments: 8
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-blue-600" />
            Portal Akun Merchant B2B & CRM Pengirim (Shipper)
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Kelola kontrak SLA korporat, Term of Payment (TOP piutang pengiriman), invoice bulanan, dan diskon volume tonase.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            + Tambah Klien B2B Baru
          </button>
        </div>
      </div>

      {/* Shippers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shippers.map((s) => (
          <div 
            key={s.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                  {s.tier.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-slate-500 font-semibold">{s.creditTerm}</span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">{s.companyName}</h4>
                <div className="text-xs text-slate-500 mt-1">PIC: <strong>{s.picName}</strong></div>
              </div>

              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{s.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{s.phone}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Volume / Bulan</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{s.monthlyVolume}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Spend YTD</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">Rp {(s.totalSpendYtd / 1000000).toFixed(0)} Juta</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Aktif: <strong>{s.activeShipments} Kiriman</strong></span>
              <button className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-300 rounded-lg text-xs font-semibold transition-all">
                Detail Kontrak & Tarif
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
