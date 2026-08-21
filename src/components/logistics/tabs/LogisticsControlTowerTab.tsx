import React from 'react';
import { 
  Radar, 
  Truck, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Layers, 
  MapPin, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { LogisticsOrder, LogisticsManifest, LogisticsHub, LogisticsSummaryKpis } from '../../../modules/logistics/types';

interface Props {
  kpis: LogisticsSummaryKpis;
  orders: LogisticsOrder[];
  manifests: LogisticsManifest[];
  hubs: LogisticsHub[];
  onSelectOrder: (order: LogisticsOrder) => void;
  onNavigateTab: (tab: string) => void;
}

export const LogisticsControlTowerTab: React.FC<Props> = ({
  kpis,
  orders,
  manifests,
  hubs,
  onSelectOrder,
  onNavigateTab
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner Control Tower Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-blue-600/20 via-indigo-600/10 to-transparent rounded-full blur-3xl -z-0 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live TMS Operations Dispatch
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Radar className="w-8 h-8 text-blue-400 animate-spin-slow" />
              Logistics Control Tower 24/7
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl">
              Pusat komando terintegrasi: Pemantauan multi-hub antarkota, jalur linehaul antar pulau, load factor armada tronton/wingbox, dan auto-dispatching AI.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => onNavigateTab('orders')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              + Order Pengiriman Baru
            </button>
            <button 
              onClick={() => onNavigateTab('manifests')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold border border-slate-700 transition-all flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              Buat Manifest Kargo
            </button>
          </div>
        </div>

        {/* Real-time KPI Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Pengiriman Hari Ini</span>
              <Package className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">{kpis.totalShipmentsToday.toLocaleString()}</div>
            <div className="text-emerald-400 text-xs mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3" /> +14.2% vs kemarin
            </div>
          </div>

          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Sedang In-Transit (Live)</span>
              <Truck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 tracking-tight">{kpis.inTransitCount.toLocaleString()}</div>
            <div className="text-slate-400 text-xs mt-1">
              Linehaul & Last-mile delivery
            </div>
          </div>

          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Terkirim Sukses (ePOD)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">{kpis.deliveredTodayCount.toLocaleString()}</div>
            <div className="text-emerald-400 text-xs mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> 100% digital signature
            </div>
          </div>

          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>On-Time SLA Delivery</span>
              <Activity className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-indigo-300 tracking-tight">{kpis.onTimeDeliveryRate}%</div>
            <div className="text-slate-400 text-xs mt-1">
              Target kepatuhan ≥98.0%
            </div>
          </div>

          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Tonase Muatan Kargo</span>
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-300 tracking-tight">{kpis.totalWeightTonsToday} Ton</div>
            <div className="text-slate-400 text-xs mt-1">
              Load Factor: {kpis.fleetUtilizationRate}%
            </div>
          </div>
        </div>
      </div>

      {/* 2 Columns: Live Linehaul In-Transit & Hub Network Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Linehaul Manifests in Transit */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                Linehaul Antar Hub & Tronton Aktif
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">Perjalanan armada kargo antar kota dengan seal security GPS</p>
            </div>
            <button 
              onClick={() => onNavigateTab('manifests')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Lihat Semua Manifest <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {manifests.map((m) => (
              <div 
                key={m.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer"
                onClick={() => onNavigateTab('manifests')}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{m.manifestNumber}</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                          {m.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {m.vehiclePlate} • Driver: <span className="text-slate-700 dark:text-slate-300 font-medium">{m.driverName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Segel: {m.sealNumber}</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Load: {m.capacityUtilizationPct}% ({m.totalWeightKg.toLocaleString()} kg / {m.totalCbm} CBM)
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{m.originHubName.split('(')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{m.destinationHubName.split('(')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>ETA: {new Date(m.estimatedArrivalTime || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} WIB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hub Capacity & Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Jaringan Hub & Staging Depo
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              {hubs.length} Hubs
            </span>
          </div>

          <div className="space-y-4">
            {hubs.map((hub) => {
              const utilPct = Math.round((hub.currentStoredCbm / hub.dailyCapacityCbm) * 100);
              return (
                <div 
                  key={hub.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">{hub.code} - {hub.city}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{hub.name}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      hub.operationalStatus === 'OPERATIONAL' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                    }`}>
                      {hub.operationalStatus}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Kapasitas Storage</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{utilPct}% ({hub.currentStoredCbm}/{hub.dailyCapacityCbm} CBM)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${utilPct > 85 ? 'bg-amber-500' : 'bg-indigo-600'}`} 
                        style={{ width: `${utilPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-700/60">
                    <span>{hub.activeVehiclesCount} Armada Standby</span>
                    <span>{hub.activeParcelsCount.toLocaleString()} Paket Inbound</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Priority Tracking & Recent Shipments Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Paket & Resi Prioritas Terkini
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">Daftar connote/waybill pengiriman aktif beserta status SLA</p>
          </div>
          <button 
            onClick={() => onNavigateTab('orders')}
            className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 transition-all self-start"
          >
            Buka Manajemen Order Lengkap
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="pb-3">No. Resi (Connote)</th>
                <th className="pb-3">Pengirim (Shipper)</th>
                <th className="pb-3">Penerima & Kota Tujuan</th>
                <th className="pb-3">Layanan</th>
                <th className="pb-3">Berat / CBM</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">SLA Status</th>
                <th className="pb-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 font-bold text-blue-600 dark:text-blue-400 font-mono">
                    {ord.connoteNumber}
                    <div className="text-[10px] text-slate-400 font-sans font-normal">{ord.orderNumber}</div>
                  </td>
                  <td className="py-3 font-medium text-slate-900 dark:text-slate-200">
                    {ord.shipperName}
                  </td>
                  <td className="py-3">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{ord.consigneeName}</div>
                    <div className="text-slate-500 text-[11px]">{ord.consigneeCity} ({ord.consigneePostalCode})</div>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {ord.serviceType}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-900 dark:text-slate-200">{ord.totalWeightKg} kg</span>
                    <span className="text-[10px] text-slate-400 block">{ord.totalVolumeCbm} m³</span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.status === 'DELIVERED' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : ord.status === 'FAILED_DELIVERY'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                    }`}>
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3">
                    {ord.isSlaBreached ? (
                      <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1 text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" /> SLA Terlewati
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> On Time
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <button 
                      onClick={() => onSelectOrder(ord)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-300 rounded-lg transition-all"
                    >
                      Detail & e-POD
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
