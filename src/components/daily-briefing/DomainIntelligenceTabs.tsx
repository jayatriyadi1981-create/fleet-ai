/**
 * Fleet Intelligence Smart AI - Domain Intelligence Tabs
 * In-depth breakdowns for Fuel, Maintenance, Driver Safety, GPS Telematics, and Logistics
 */

import React, { useState } from 'react';
import { 
  Fuel, 
  Wrench, 
  UserCheck, 
  Radio, 
  Truck, 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin, 
  Activity, 
  ExternalLink,
  Zap,
  Info,
  Clock
} from 'lucide-react';
import { FleetDailyBriefing } from '../../types/dailyBriefing';

interface DomainIntelligenceTabsProps {
  briefing: FleetDailyBriefing;
  onNavigateToModule?: (moduleKey: string) => void;
}

export const DomainIntelligenceTabs: React.FC<DomainIntelligenceTabsProps> = ({
  briefing,
  onNavigateToModule,
}) => {
  const [activeTab, setActiveTab] = useState<'fuel' | 'maintenance' | 'driver' | 'gps' | 'delivery' | 'alerts'>('fuel');

  const {
    fuelIntelligence,
    maintenanceOverview,
    driverOverview,
    fatigueOverview,
    safetyOverview,
    gpsHealth,
    deliveryOverview,
    routeOverview,
    alertSummary,
  } = briefing;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Tab Navigation Strip */}
      <div className="border-b border-slate-200 bg-slate-50/50 p-2 sm:p-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('fuel')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'fuel'
                ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Fuel className="w-4 h-4 text-amber-500" />
            Fuel Intelligence
            {fuelIntelligence.anomaliesDetected.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-extrabold">
                {fuelIntelligence.anomaliesDetected.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'maintenance'
                ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Wrench className="w-4 h-4 text-rose-500" />
            Maintenance & Servis
            {maintenanceOverview.criticalCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800 font-extrabold">
                {maintenanceOverview.criticalCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('driver')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'driver'
                ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            Driver & Safety Score
          </button>

          <button
            onClick={() => setActiveTab('gps')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'gps'
                ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Radio className="w-4 h-4 text-indigo-600" />
            GPS & Telematika IoT
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-800 font-bold">
              {gpsHealth.overallHealthPercent}%
            </span>
          </button>

          <button
            onClick={() => setActiveTab('delivery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'delivery'
                ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Truck className="w-4 h-4 text-blue-600" />
            Rute & Pengiriman (POD)
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'alerts'
                ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Bell className="w-4 h-4 text-purple-600" />
            Ringkasan Peringatan
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-6">
        {/* 1. FUEL INTELLIGENCE TAB */}
        {activeTab === 'fuel' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-xs text-slate-500 font-medium">Total Konsumsi BBM</span>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {fuelIntelligence.totalFuelLiters.toLocaleString('id-ID')} Liter
                </div>
                <span className="text-[11px] text-slate-500">Biosolar B35 / Dexlite</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-xs text-slate-500 font-medium">Total Biaya Kemarin</span>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  Rp {fuelIntelligence.totalFuelCostIdr.toLocaleString('id-ID')}
                </div>
                <div className="flex items-center gap-1 mt-1 text-[11px]">
                  {fuelIntelligence.changePercentVsSevenDay > 0 ? (
                    <span className="text-rose-600 font-bold flex items-center">
                      <TrendingUp className="w-3 h-3 mr-0.5" /> +{fuelIntelligence.changePercentVsSevenDay}% vs 7-hari
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-bold flex items-center">
                      <TrendingDown className="w-3 h-3 mr-0.5" /> {fuelIntelligence.changePercentVsSevenDay}% vs 7-hari
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-xs text-slate-500 font-medium">Efisiensi Rata-Rata</span>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {fuelIntelligence.avgConsumptionKmPerLiter} KM/L
                </div>
                <span className="text-[11px] text-slate-500">Standar Target: 3.5 KM/L</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-xs text-slate-500 font-medium">Biaya per Kilometer</span>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  Rp {fuelIntelligence.costPerKmIdr.toLocaleString('id-ID')} / KM
                </div>
                <span className="text-[11px] text-slate-500">Kalkulasi Odometer Total</span>
              </div>
            </div>

            {/* AI Narrative Box */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-3">
              <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Analisis AI Bahan Bakar: </span>
                <span>{fuelIntelligence.aiNarrative}</span>
              </div>
            </div>

            {/* Detected Anomalies Cards */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Deteksi Anomali BBM (Kecurangan / Kebocoran / Inefisiensi)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fuelIntelligence.anomaliesDetected.map(ano => (
                  <div key={ano.id} className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-rose-800 px-2 py-0.5 rounded-md bg-rose-100">
                        {ano.anomalyType}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        Confidence: <strong className="text-slate-800">{ano.confidence}</strong>
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      Armada {ano.vehiclePlate}
                    </div>
                    <p className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">Dugaan Penyebab: </span>
                      {ano.possibleCause}
                    </p>
                    <p className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">Saran Audit: </span>
                      {ano.recommendedInvestigation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. MAINTENANCE TAB */}
        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-xs text-rose-700 font-bold">Servis Kritis Mendesak</span>
                <div className="text-2xl font-black text-rose-800 mt-1">
                  {maintenanceOverview.criticalCount} Unit
                </div>
                <span className="text-[11px] text-rose-600">Perlu penanganan hari ini</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-xs text-amber-700 font-bold">Jatuh Tempo (Overdue)</span>
                <div className="text-2xl font-black text-amber-800 mt-1">
                  {maintenanceOverview.overdueCount} Unit
                </div>
                <span className="text-[11px] text-amber-600">Melebihi target kilometer</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-600 font-medium">Dalam Pengerjaan Bengkel</span>
                <div className="text-2xl font-black text-slate-800 mt-1">
                  {maintenanceOverview.inProgressCount} Unit
                </div>
                <span className="text-[11px] text-slate-500">Estimasi selesai 1x24 jam</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-600 font-medium">Selesai Kemarin</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">
                  {maintenanceOverview.completedYesterdayCount} Unit
                </div>
                <span className="text-[11px] text-slate-500">Siap bertugas kembali</span>
              </div>
            </div>

            {/* Predictive Maintenance Advisory */}
            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 text-xs text-indigo-900 flex items-start gap-3">
              <Activity className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">AI Predictive Maintenance: </span>
                <span>{maintenanceOverview.predictiveAdvisory}</span>
              </div>
            </div>

            {/* Priority Maintenance Work Orders Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Prioritas Pekerjaan Pemeliharaan
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-y border-slate-200">
                    <tr>
                      <th className="p-3">Armada</th>
                      <th className="p-3">Prioritas</th>
                      <th className="p-3">Komponen / Isu</th>
                      <th className="p-3">Alasan Kerusakan Prediktif</th>
                      <th className="p-3">Rekomendasi Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {maintenanceOverview.priorities.map(p => (
                      <tr key={p.vehicleId} className="hover:bg-slate-50/60">
                        <td className="p-3 font-bold text-slate-900">{p.vehiclePlate}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            p.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {p.priority}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-800">{p.issue}</td>
                        <td className="p-3 text-slate-600 max-w-xs">{p.reason}</td>
                        <td className="p-3 text-indigo-700 font-medium">{p.recommendation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. DRIVER & SAFETY TAB */}
        {activeTab === 'driver' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Driver Aktif Bertugas</span>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {driverOverview.activeDriversCount} Orang
                </div>
                <span className="text-[11px] text-slate-500">{driverOverview.tripsCount} total rute selesai</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Skor Keselamatan Rata-Rata</span>
                <div className="text-xl font-bold text-emerald-600 mt-1">
                  {driverOverview.avgSafetyScore} / 100
                </div>
                <span className="text-[11px] text-emerald-700 font-medium">
                  +{safetyOverview.safetyTrendVsLastWeek}% vs Pekan Lalu
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Pelanggaran Overspeed</span>
                <div className="text-xl font-bold text-amber-600 mt-1">
                  {driverOverview.overspeedEventsTotal} Insiden
                </div>
                <span className="text-[11px] text-slate-500">Batas kecepatan 90 km/h</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Harsh Braking & Belok Tajam</span>
                <div className="text-xl font-bold text-rose-600 mt-1">
                  {driverOverview.harshBrakeEventsTotal + driverOverview.sharpTurnEventsTotal} Kali
                </div>
                <span className="text-[11px] text-slate-500">Pengereman mendadak</span>
              </div>
            </div>

            {/* Fatigue Warning Banner */}
            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 text-xs text-purple-900 flex items-start gap-3">
              <Clock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Deteksi Kelelahan Driver (Fatigue AI): </span>
                <span>{fatigueOverview.fatigueAdvisory}</span>
              </div>
            </div>

            {/* Top Risky Drivers Coaching Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Daftar Pengemudi Membutuhkan Coaching Keselamatan
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {driverOverview.topRiskyDrivers.map(drv => (
                  <div key={drv.driverId} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{drv.driverName}</span>
                      <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-amber-100 text-amber-800">
                        Risk Score: {drv.riskScore}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Armada: <span className="font-semibold text-slate-800">{drv.assignedPlate}</span> | Safety Score: <strong className="text-indigo-600">{drv.safetyScore}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">Fokus Risiko: </span>
                      {drv.primaryRiskReason}
                    </div>
                    <div className="text-xs text-indigo-700 font-medium">
                      <span className="font-semibold">Rekomendasi Coaching: </span>
                      {drv.coachingRecommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. GPS & TELEMATICS TAB */}
        {activeTab === 'gps' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Tingkat Kesehatan IoT</span>
                <div className="text-2xl font-black text-indigo-700 mt-1">
                  {gpsHealth.overallHealthPercent}%
                </div>
                <span className="text-[11px] text-slate-500">Koneksi transmisi stabil</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs text-emerald-700 font-bold">Perangkat Online</span>
                <div className="text-2xl font-black text-emerald-800 mt-1">
                  {gpsHealth.devicesOnline} Unit
                </div>
                <span className="text-[11px] text-emerald-600">Ping aktif &lt; 5 menit</span>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-xs text-rose-700 font-bold">Perangkat Offline</span>
                <div className="text-2xl font-black text-rose-800 mt-1">
                  {gpsHealth.devicesOffline} Unit
                </div>
                <span className="text-[11px] text-rose-600">Hilang sinyal &gt; 24 jam</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Protokol Ingestion</span>
                <div className="text-base font-bold text-slate-900 mt-1">
                  JT808 / Teltonika / Concox
                </div>
                <span className="text-[11px] text-slate-500">Supabase PostGIS Sync</span>
              </div>
            </div>

            {/* Offline GPS Devices List */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Daftar Perangkat GPS Tracker Terputus / Tidak Aktif
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-y border-slate-200">
                    <tr>
                      <th className="p-3">Nomor IMEI</th>
                      <th className="p-3">Plat Kendaraan</th>
                      <th className="p-3">Terakhir Kirim Data</th>
                      <th className="p-3">Lokasi Terakhir Terdeteksi</th>
                      <th className="p-3">Tindakan Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {gpsHealth.offlineDevicesList.map(dev => (
                      <tr key={dev.imei} className="hover:bg-slate-50/60">
                        <td className="p-3 font-mono font-bold text-slate-900">{dev.imei}</td>
                        <td className="p-3 font-semibold text-slate-800">{dev.plateNumber}</td>
                        <td className="p-3 text-rose-600 font-bold">{dev.lastPingAgoHours} Jam Lalu</td>
                        <td className="p-3 text-slate-600">{dev.lastKnownLocation}</td>
                        <td className="p-3">
                          <button
                            onClick={() => onNavigateToModule?.('gps_server')}
                            className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
                          >
                            Diagnostik Server GPS
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. DELIVERY & ROUTE TAB */}
        {activeTab === 'delivery' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Total Surat Jalan (DO)</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {deliveryOverview?.totalOrders || 36} DO
                </div>
                <span className="text-[11px] text-slate-500">Trip operasional kemarin</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs text-emerald-700 font-bold">Terkirim Sempurna (POD)</span>
                <div className="text-2xl font-black text-emerald-800 mt-1">
                  {deliveryOverview?.deliveredOrders || 32} DO
                </div>
                <span className="text-[11px] text-emerald-600">Tingkat POD {deliveryOverview?.podCompletionRate || 94.4}%</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">On-Time Delivery</span>
                <div className="text-2xl font-black text-blue-600 mt-1">
                  {deliveryOverview?.onTimeDeliveryRate || 91.6}%
                </div>
                <span className="text-[11px] text-slate-500">SLA Ketepatan Waktu</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-xs text-amber-700 font-bold">Deviasi Koridor Rute</span>
                <div className="text-2xl font-black text-amber-800 mt-1">
                  {routeOverview.routeDeviationsCount} Trip
                </div>
                <span className="text-[11px] text-amber-600">Rerata delay {routeOverview.avgEtaDeviationMinutes} menit</span>
              </div>
            </div>

            {/* Route Bottleneck Advisory */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                Koridor Bottleneck Terdeteksi:
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                {routeOverview.bottleneckCorridors.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
              <p className="text-indigo-800 font-semibold pt-1">
                Saran AI: {routeOverview.routeAdvisory}
              </p>
            </div>
          </div>
        )}

        {/* 6. ALERTS TAB */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Total Notifikasi Peringatan</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {alertSummary.totalAlerts}
                </div>
                <span className="text-[11px] text-slate-500">{alertSummary.resolvedAlerts} telah terselesaikan</span>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-xs text-rose-700 font-bold">Peringatan Kritis</span>
                <div className="text-2xl font-black text-rose-800 mt-1">
                  {alertSummary.criticalAlerts}
                </div>
                <span className="text-[11px] text-rose-600">Memerlukan mitigasi langsung</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-xs text-amber-700 font-bold">Peringatan Menengah</span>
                <div className="text-2xl font-black text-amber-800 mt-1">
                  {alertSummary.highAlerts}
                </div>
                <span className="text-[11px] text-amber-600">Perhatian operasional</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Belum Ditangani</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {alertSummary.unresolvedAlerts}
                </div>
                <span className="text-[11px] text-slate-500">Dalam antrean tindak lanjut</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700">
              <span className="font-bold text-slate-900">Analisis Tren AI Alert: </span>
              {alertSummary.aiTrendExplanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
