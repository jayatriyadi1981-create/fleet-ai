/**
 * Fleet Intelligence Smart AI - 8-Step GPS Device Onboarding Wizard
 * PROMPT 10 - Enterprise Device Onboarding, IMEI Verification & Vehicle Integration
 */

import React, { useState } from 'react';
import { gpsDeviceService } from '../../services/gpsDeviceService';
import { useFleet } from '../../context/FleetContext';
import { useToast } from '../ui/Toast';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Cpu,
  Radio,
  Wifi,
  Truck,
  Settings,
  Activity,
  HardDrive,
  AlertTriangle
} from 'lucide-react';

interface DeviceOnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted: (deviceId: string) => void;
}

export const DeviceOnboardingWizard: React.FC<DeviceOnboardingWizardProps> = ({
  isOpen,
  onClose,
  onCompleted
}) => {
  const { vehicles } = useFleet();
  const { showSuccess, showError } = useToast();

  const [step, setStep] = useState<number>(1);

  // Step 1: Device Basics
  const [manufacturer, setManufacturer] = useState<string>('Teltonika');
  const [model, setModel] = useState<string>('FMB920');
  const [serialNumber, setSerialNumber] = useState<string>('SN-TEL-9810239');

  // Step 2: IMEI
  const [imei, setImei] = useState<string>('860123456789099');
  const [imeiError, setImeiError] = useState<string>('');

  // Step 3: SIM
  const [simNumber, setSimNumber] = useState<string>('+628129841099');
  const [iccid, setIccid] = useState<string>('8962011234567890199');
  const [simProvider, setSimProvider] = useState<'Telkomsel' | 'Indosat' | 'XL' | 'Smartfren'>('Telkomsel');
  const [apn, setApn] = useState<string>('m2m.telkomsel.id');

  // Step 4: Protocol
  const [protocolId, setProtocolId] = useState<string>('PROTO-TELTONIKA');

  // Step 5: Vehicle
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');

  // Step 6: Configuration
  const [pingInterval, setPingInterval] = useState<number>(10);
  const [serverHost, setServerHost] = useState<string>('gateway.fleet-ai.id:5027');

  // Step 7: Verification Simulation
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifyPassed, setVerifyPassed] = useState<boolean>(false);

  // Step 8: Completed
  const [createdDeviceId, setCreatedDeviceId] = useState<string>('');

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (step === 2) {
      const val = gpsDeviceService.validateIMEI(imei);
      if (!val.valid) {
        setImeiError(val.error || 'IMEI tidak valid.');
        return;
      }
      setImeiError('');
    }

    if (step === 7) {
      // Execute Verification
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setVerifyPassed(true);

        // Register in database
        const selectedVeh = vehicles.find((v) => v.id === selectedVehicleId);
        const newDevice = gpsDeviceService.createDevice({
          tenantId: 'TENANT-TLN-001',
          deviceCode: '',
          imei,
          serialNumber,
          manufacturer,
          model,
          protocolId,
          protocolName: protocolId === 'PROTO-TELTONIKA' ? 'Teltonika Codec 8' : 'GT06 / Concox',
          firmwareVersion: 'v03.28.07.Rev.02',
          status: 'active',
          connectionStatus: 'online',
          healthStatus: 'healthy',
          inventoryStatus: 'installed',
          simNumber,
          simProvider,
          vehicleId: selectedVehicleId,
          vehiclePlate: selectedVeh?.plateNumber,
          installationDate: new Date().toISOString().split('T')[0],
          lastPingAt: new Date().toISOString()
        });

        setCreatedDeviceId(newDevice.id);
        showSuccess('Registrasi GPS Berhasil', `Perangkat ${newDevice.deviceCode} telah dikonfigurasi.`);
        setStep(8);
      }, 1200);
      return;
    }

    setStep((prev) => Math.min(8, prev + 1));
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const stepsLabels = [
    'Device',
    'IMEI',
    'SIM',
    'Protocol',
    'Vehicle',
    'Config',
    'Verify',
    'Complete'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-500/10 p-2.5 text-cyan-400 border border-cyan-500/20">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Registrasi & Onboarding Perangkat GPS</h2>
              <p className="text-xs text-slate-400">
                Wizard pendaftaran perangkat IoT telematika baru (Langkah {step} dari 8)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/30 flex items-center justify-between overflow-x-auto no-scrollbar">
          {stepsLabels.map((lbl, idx) => {
            const num = idx + 1;
            const isCompleted = step > num;
            const isCurrent = step === num;
            return (
              <div key={idx} className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950'
                      : isCurrent
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : num}
                </span>
                <span className={`text-[11px] font-semibold ${isCurrent ? 'text-white' : 'text-slate-500'}`}>
                  {lbl}
                </span>
                {idx < 7 && <span className="text-slate-700 text-xs px-1">›</span>}
              </div>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Step 1: Device Basics */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-white">Langkah 1: Identitas Aset Hardware GPS</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-slate-300 font-semibold">Pabrikan Vendor GPS</label>
                  <select
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="iStartek">iStartek (VT900/VT600/VT200)</option>
                    <option value="Teltonika">Teltonika</option>
                    <option value="Concox">Concox / Jimi IoT</option>
                    <option value="Queclink">Queclink</option>
                    <option value="Ruptela">Ruptela</option>
                    <option value="Suntech">Suntech</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold">Model Perangkat</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="e.g. FMB920"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold">Serial Number Fisik</label>
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:border-cyan-500 focus:outline-none font-mono"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: IMEI */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-white">Langkah 2: Registrasi Nomor IMEI (15 Digit)</h3>
              <div className="space-y-2">
                <label className="text-slate-300 font-semibold">Nomor IMEI Tracker</label>
                <input
                  type="text"
                  value={imei}
                  onChange={(e) => {
                    setImei(e.target.value);
                    setImeiError('');
                  }}
                  maxLength={15}
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-cyan-300 font-mono text-sm font-bold focus:border-cyan-500 focus:outline-none"
                  placeholder="860123456789012"
                  required
                />
                {imeiError ? (
                  <p className="text-rose-400 font-semibold text-[11px] flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {imeiError}
                  </p>
                ) : (
                  <p className="text-slate-500 text-[11px]">Server akan memverifikasi uniknya IMEI dalam lingkup tenant.</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: SIM Card */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-white">Langkah 3: Kartu SIM M2M & APN</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold">Provider Seluler</label>
                  <select
                    value={simProvider}
                    onChange={(e) => setSimProvider(e.target.value as any)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white"
                  >
                    <option value="Telkomsel">Telkomsel IoT</option>
                    <option value="XL">XL Axiata IoT</option>
                    <option value="Indosat">Indosat Ooredoo</option>
                    <option value="Smartfren">Smartfren</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold">Nomor SIM Card</label>
                  <input
                    type="text"
                    value={simNumber}
                    onChange={(e) => setSimNumber(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-slate-300 font-semibold">Nomor ICCID (19-20 Digit)</label>
                  <input
                    type="text"
                    value={iccid}
                    onChange={(e) => setIccid(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Protocol */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-white">Langkah 4: Pilih Protocol Telematika</h3>
              <div className="space-y-2">
                <label className="text-slate-300 font-semibold">Adapter Protocol Gateway</label>
                <select
                  value={protocolId}
                  onChange={(e) => setProtocolId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white"
                >
                  <option value="PROTO-ISTARTEK">iStartek VT/PT Protocol ($$ ASCII, TCP 5055)</option>
                  <option value="PROTO-TELTONIKA">Teltonika Codec 8 / 8 Extended (TCP 5027)</option>
                  <option value="PROTO-GT06">GT06 / Concox Protocol (TCP 5023)</option>
                  <option value="PROTO-QUECLINK">Queclink ASCII Protocol (UDP 5004)</option>
                  <option value="PROTO-JT808">JT/T 808 Standard (TCP 8080)</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 5: Vehicle */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-white">Langkah 5: Penugasan Unit Kendaraan</h3>
              <div className="space-y-2">
                <label className="text-slate-300 font-semibold">Pilih Kendaraan Armada</label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plateNumber} — {v.brand} {v.model} ({v.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 6: Configuration */}
          {step === 6 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-white">Langkah 6: Konfigurasi Parameter Gateway</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-slate-300 font-semibold">Host Socket Gateway</label>
                  <input
                    type="text"
                    value={serverHost}
                    onChange={(e) => setServerHost(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold">Interval Ping Laporan (Detik)</label>
                  <input
                    type="number"
                    value={pingInterval}
                    onChange={(e) => setPingInterval(Number(e.target.value))}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Verify */}
          {step === 7 && (
            <div className="p-8 text-center space-y-4">
              <Activity className="h-10 w-10 text-cyan-400 animate-bounce mx-auto" />
              <h3 className="font-bold text-base text-white">Memverifikasi Koneksi Gateway GPS...</h3>
              <p className="text-slate-400">Memeriksa registrasi IMEI, otentikasi SIM, dan handshake pertama.</p>
            </div>
          )}

          {/* Step 8: Complete */}
          {step === 8 && (
            <div className="p-8 text-center space-y-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-lg text-white">GPS Device Successfully Registered!</h3>
              <p className="text-slate-300">
                Perangkat baru terdaftar dengan ID <span className="font-mono text-cyan-300 font-bold">{createdDeviceId}</span>.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4 bg-slate-950/50">
          {step > 1 && step < 8 ? (
            <button
              onClick={handlePrevStep}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 8 ? (
            <button
              onClick={handleNextStep}
              disabled={isVerifying}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
            >
              <span>{step === 7 ? 'Jalankan Verifikasi' : 'Lanjut'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                onCompleted(createdDeviceId);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
            >
              Selesai & Buka Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
