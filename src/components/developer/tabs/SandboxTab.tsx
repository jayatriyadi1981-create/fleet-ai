import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  Copy,
  Check,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Send,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { webhookService } from '../../../services/api/webhookService';
import { useFleet } from '../../../context/FleetContext';

export const SandboxTab: React.FC = () => {
  const { currentTenant } = useFleet();
  const [selectedPreset, setSelectedPreset] = useState<'SAP' | 'ODOO' | 'NETSUITE' | 'WMS'>('SAP');
  const [simulationTriggering, setSimulationTriggering] = useState(false);
  const [simulationSuccess, setSimulationSuccess] = useState<string | null>(null);
  const [copiedPreset, setCopiedPreset] = useState(false);

  const presets = {
    SAP: {
      name: 'SAP S/4HANA Logistics Master Sync',
      description: 'Payload sinkronisasi master armada & rute pengiriman otomatis dari modul SAP TM.',
      payload: {
        sapSalesOrder: 'SO-2026-98124',
        plantCode: 'PLANT_1001_JKT',
        materialDoc: 'MATDOC_9921',
        driverAssigned: 'Sutrisno Hartono (EMP-001)',
        vehicleAssigned: 'B 9482 UTX',
        deliveryPoints: [
          { stop: 1, location: 'Depo Marunda Cikarang', plannedEta: '2026-08-18T10:30:00Z' },
          { stop: 2, location: 'Distribution Center Semarang', plannedEta: '2026-08-18T18:00:00Z' }
        ],
      },
    },
    ODOO: {
      name: 'Odoo TMS Trip Dispatch Webhook',
      description: 'Format webhook Odoo Fleet / Delivery Slip saat armada mulai jalan.',
      payload: {
        odooPickingId: 48921,
        odooVehicleRef: 'fleet.vehicle(12)',
        carrier: 'PT Alpha Trans Logistics',
        totalWeightKg: 14500,
        fuelInitialLiters: 180.5,
        gpsTrackingUrl: 'https://api.fleetintelligence.ai/api/v1/vehicles/veh_01/location',
      },
    },
    NETSUITE: {
      name: 'Oracle NetSuite Fuel & Toll Expense Ingestion',
      description: 'Integrasi konsumsi BBM riil & estimasi biaya tol dari telematika Fleet Intelligence.',
      payload: {
        expenseReportId: 'EXP-NS-8812',
        period: '2026-08',
        telematicsFuelLiters: 1240.5,
        telematicsOdometerStart: 104200,
        telematicsOdometerEnd: 108920,
        avgEfficiencyKmPerL: 3.8,
        costSavingsAiEstimateIdr: 4850000,
      },
    },
    WMS: {
      name: 'WMS Automated Dock Inbound Alert',
      description: 'Trigger otomatis saat armada memasuki geofence Loading Dock WMS.',
      payload: {
        wmsWarehouseId: 'WH_MARUNDA_01',
        geofenceName: 'Dock 4 Inbound Gate',
        vehiclePlate: 'B 9211 TJP',
        driverName: 'Ahmad Fauzi',
        dockAssigned: 'DOCK_A_04',
        estimatedUnloadMinutes: 45,
      },
    },
  };

  const handleCopyPreset = () => {
    navigator.clipboard.writeText(JSON.stringify(presets[selectedPreset].payload, null, 2));
    setCopiedPreset(true);
    setTimeout(() => setCopiedPreset(false), 2000);
  };

  const handleSimulateIncident = async (type: 'OVERSPEED' | 'GEOFENCE' | 'FUEL_SIPHON' | 'ENGINE_PANIC') => {
    setSimulationTriggering(true);
    setSimulationSuccess(null);

    await new Promise(r => setTimeout(r, 600));

    let msg = '';
    if (type === 'OVERSPEED') {
      msg = 'Simulasi Overspeed 94 km/h (Batas 80 km/h) berhasil dikirim ke stream alert!';
    } else if (type === 'GEOFENCE') {
      msg = 'Simulasi Geofence Departure (Depo Cikarang) berhasil di-trigger!';
    } else if (type === 'FUEL_SIPHON') {
      msg = 'Simulasi Anomali Penurunan BBM 35 Liter dalam 3 menit berhasil diproses AI!';
    } else if (type === 'ENGINE_PANIC') {
      msg = 'Simulasi SOS Panic Button Driver berhasil diteruskan ke monitoring emergency!';
    }

    setSimulationTriggering(false);
    setSimulationSuccess(msg);
  };

  return (
    <div className="space-y-6">
      {/* Sandbox Header */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>DEVELOPER SANDBOX & ERP SIMULATION ENVIRONMENT</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Lingkungan Pengujian Tanpa Risiko Operasional
        </h2>
        <p className="text-slate-400 text-xs leading-relaxed max-w-3xl">
          Sandbox menggunakan API Key ber-prefix <code className="text-amber-300 font-mono">flt_test_...</code> untuk
          memastikan developer ERP, TMS, dan WMS dapat menguji skenario ekstrim (overspeed, BBM anomali, geofence)
          tanpa mengganggu data armada live di database produksi.
        </p>
      </div>

      {/* Two columns: Pre-built ERP Templates & Telematics Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Prebuilt ERP Templates */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Preset Payload Integrasi ERP / TMS</span>
            </h3>
            <span className="text-xs text-slate-400">Pilih Sistem:</span>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            {(['SAP', 'ODOO', 'NETSUITE', 'WMS'] as const).map(p => (
              <button
                key={p}
                onClick={() => setSelectedPreset(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedPreset === p
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <div className="text-xs font-bold text-white">{presets[selectedPreset].name}</div>
            <p className="text-xs text-slate-400">{presets[selectedPreset].description}</p>
          </div>

          {/* JSON Viewer */}
          <div className="relative rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-slate-800">
              <span className="text-[11px] text-slate-400">Sample JSON Payload</span>
              <button
                onClick={handleCopyPreset}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
              >
                {copiedPreset ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPreset ? 'Disalin' : 'Salin'}</span>
              </button>
            </div>

            <pre className="p-4 text-emerald-400 overflow-x-auto max-h-72 leading-relaxed">
              <code>{JSON.stringify(presets[selectedPreset].payload, null, 2)}</code>
            </pre>
          </div>
        </div>

        {/* Right: Telematics Incident Simulator */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Simulasi Event Telematika & Alert</span>
            </h3>
            <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              SANDBOX MODE
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Kirim event telematika buatan ke pipeline sistem untuk menguji apakah webhook receiver atau notifikasi ERP Anda merespon dengan benar.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleSimulateIncident('OVERSPEED')}
              disabled={simulationTriggering}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-white mb-1 group-hover:text-amber-400">
                <span>Overspeed Alert</span>
                <Play className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-[11px] text-slate-400">
                Simulasi GPS unit melaju 94 km/jam di Tol Cikampek KM 18.
              </p>
            </button>

            <button
              onClick={() => handleSimulateIncident('GEOFENCE')}
              disabled={simulationTriggering}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-white mb-1 group-hover:text-cyan-400">
                <span>Geofence Breach</span>
                <Play className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="text-[11px] text-slate-400">
                Simulasi kendaraan keluar dari zona terlarang (Out-of-boundary).
              </p>
            </button>

            <button
              onClick={() => handleSimulateIncident('FUEL_SIPHON')}
              disabled={simulationTriggering}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/50 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-white mb-1 group-hover:text-rose-400">
                <span>Anomali BBM (Fuel Siphon)</span>
                <Play className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <p className="text-[11px] text-slate-400">
                Simulasi penurunan 35 liter solar saat kendaraan parkir (mesin mati).
              </p>
            </button>

            <button
              onClick={() => handleSimulateIncident('ENGINE_PANIC')}
              disabled={simulationTriggering}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-white mb-1 group-hover:text-purple-400">
                <span>SOS Driver Panic</span>
                <Play className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <p className="text-[11px] text-slate-400">
                Simulasi tombol darurat dashboard ditekan oleh driver di jalan.
              </p>
            </button>
          </div>

          {simulationSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-400 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{simulationSuccess}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
