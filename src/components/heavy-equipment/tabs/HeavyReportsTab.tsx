import React from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Fuel, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';
import { HeavyEquipmentAsset, ConstructionProject, DailyTimesheet } from '../../../modules/heavy-equipment/types';

interface Props {
  equipments: HeavyEquipmentAsset[];
  projects: ConstructionProject[];
  timesheets: DailyTimesheet[];
}

export const HeavyReportsTab: React.FC<Props> = ({
  equipments,
  projects,
  timesheets
}) => {
  const handleExport = (reportName: string) => {
    const blob = new Blob([`Laporan: ${reportName}\nGenerated At: ${new Date().toISOString()}\nTotal Units: ${equipments.length}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const reportList = [
    {
      title: 'Rekapitulasi Daily Timesheet & Hour Meter (HM)',
      desc: 'Laporan jam operasi produksi, jam idle, standby hujan/antrian, dan rincian aktivitas operator per shift.',
      icon: Clock,
      count: `${timesheets.length} Data Terverifikasi`
    },
    {
      title: 'Laporan Konsumsi BBM Solar & Fuel Burn Rate',
      desc: 'Audit distribusi solar fuel bowser, voucher BBM per alat, biaya per jam kerja, dan analisa burn rate (L/HM).',
      icon: Fuel,
      count: 'Bulanan / Periode'
    },
    {
      title: 'Laporan Kepatuhan P2H & Golden Safety Rules K3',
      desc: 'Rekap checklist harian operator, temuan defect kritis, tag-out merah alat, dan validitas SIO Kemenaker.',
      icon: ShieldCheck,
      count: 'Compliance 96.8%'
    },
    {
      title: 'Laporan KPI Physical Availability (PA) & Utilisasi (UA)',
      desc: 'Evaluasi ketersediaan mekanis alat berat, mean time between failures (MTBF), dan efisiensi utilisasi armada tambang.',
      icon: Truck,
      count: 'Rata-rata PA 92.4%'
    },
    {
      title: 'Laporan Rekap Tagihan Rental Alat Berat',
      desc: 'Faktur sewa bulanan, minimum charge garansi HM (100–250 jam), lembur overtime, dan biaya mob-demob.',
      icon: FileSpreadsheet,
      count: 'Rekapitulasi Invoice'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-amber-500" />
          Pusat Laporan Komprehensif Alat Berat & Manajemen Proyek
        </h3>
        <p className="text-xs text-slate-500">
          Ekspor dokumen rekapitulasi timesheet, konsumsi solar, kepatuhan P2H K3, performa PA/UA, dan penagihan rental ke format CSV/Excel.
        </p>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reportList.map((rep, idx) => {
          const Icon = rep.icon;
          return (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    {rep.count}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{rep.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{rep.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">Format: CSV, Excel, PDF</span>
                <button
                  onClick={() => handleExport(rep.title)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh Laporan
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
