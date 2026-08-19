/**
 * Fleet Intelligence Smart AI - Vehicle Form Component
 * PROMPT 9 - Create (/app/fleet/vehicles/new) & Edit (/app/fleet/vehicles/:id/edit)
 */

import React, { useState, useEffect } from 'react';
import { VehicleExtended, VehicleType, FuelType, TransmissionType, OwnershipType, VehicleStatus } from '../../types/vehicle';
import { vehicleService } from '../../services/vehicleService';
import { useFleet } from '../../context/FleetContext';
import { useToast } from '../ui/Toast';
import { 
  Truck, 
  Wrench, 
  FileText, 
  Building2, 
  Save, 
  ArrowLeft, 
  Check, 
  AlertCircle,
  Radio,
  User,
  ShieldCheck
} from 'lucide-react';

interface VehicleFormProps {
  vehicleId?: string; // If provided, edit mode
  onBack: () => void;
  onSuccess: (savedVehicle: VehicleExtended) => void;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ vehicleId, onBack, onSuccess }) => {
  const { drivers, gpsDevices } = useFleet();
  const { addToast } = useToast();

  const isEditMode = !!vehicleId;
  const [activeTab, setActiveTab] = useState<'basic' | 'specs' | 'legal' | 'org'>('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [plateError, setPlateError] = useState('');

  // Dropdown options
  const [groups, setGroups] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState<Partial<VehicleExtended>>({
    vehicleCode: '',
    name: '',
    licensePlate: '',
    type: 'truck_box',
    brand: 'Hino',
    model: 'Ranger FL 235',
    variant: 'Standard Box 6x2',
    year: 2024,
    color: 'Putih - White',
    fuelType: 'biodiesel_b35',
    transmission: 'manual',
    ownership: 'company_owned',
    status: 'moving',

    // Technical
    vin: '',
    chassisNumber: '',
    engineNumber: '',
    engineCapacityCc: 7684,
    fuelCapacityLiters: 200,
    payloadKg: 12000,
    grossVehicleWeightKg: 18000,
    numberOfWheels: 6,
    tireSize: '10.00-20 16PR',
    odometerKm: 0,
    engineHours: 0,

    // Legal
    stnkNumber: '',
    stnkExpiry: '',
    bpkbNumber: '',
    kirNumber: '',
    kirExpiry: '',
    pajakExpiry: '',
    insuranceCompany: 'PT Asuransi Sinar Mas',
    insurancePolicyNumber: '',
    insuranceExpiry: '',

    // Org
    groupId: 'grp-1',
    branchId: 'br-jkt',
    departmentId: 'dept-ops',
    primaryDriverId: '',
    gpsDeviceId: 'dev-01',
  });

  // Load dropdown lists and vehicle data if edit mode
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        setIsLoading(true);
        const [grps, brs, depts] = await Promise.all([
          vehicleService.listGroups(),
          vehicleService.listBranches(),
          vehicleService.listDepartments(),
        ]);
        setGroups(grps);
        setBranches(brs);
        setDepartments(depts);

        if (isEditMode && vehicleId) {
          const veh = await vehicleService.getVehicleById(vehicleId);
          if (veh) {
            setFormData(veh);
          } else {
            addToast({ type: 'error', title: 'Error', message: 'Kendaraan tidak ditemukan' });
            onBack();
          }
        }
      } catch (err: any) {
        addToast({ type: 'error', title: 'Error', message: err.message || 'Gagal memuat data' });
      } finally {
        setIsLoading(false);
      }
    };

    loadMasterData();
  }, [vehicleId]);

  const handleChange = (field: keyof VehicleExtended, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'licensePlate') {
      setPlateError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.name?.trim()) {
      addToast({ type: 'warning', title: 'Form Tidak Lengkap', message: 'Nama Kendaraan wajib diisi.' });
      setActiveTab('basic');
      return;
    }

    if (!formData.licensePlate?.trim()) {
      addToast({ type: 'warning', title: 'Form Tidak Lengkap', message: 'Plat Nomor Kendaraan wajib diisi.' });
      setActiveTab('basic');
      return;
    }

    try {
      setIsSaving(true);
      let result: VehicleExtended;

      if (isEditMode && vehicleId) {
        result = await vehicleService.updateVehicle(vehicleId, formData);
        addToast({
          type: 'success',
          title: 'Perubahan Disimpan',
          message: `Data kendaraan ${result.licensePlate} berhasil diperbarui.`,
        });
      } else {
        result = await vehicleService.createVehicle(formData as any);
        addToast({
          type: 'success',
          title: 'Kendaraan Ditambahkan',
          message: `Unit kendaraan ${result.licensePlate} berhasil terdaftar.`,
        });
      }

      onSuccess(result);
    } catch (err: any) {
      if (err.message && err.message.includes('Plat nomor')) {
        setPlateError(err.message);
        setActiveTab('basic');
      } else {
        addToast({ type: 'error', title: 'Gagal Menyimpan', message: err.message || 'Terjadi kesalahan sistem' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
        <div className="space-y-3">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="text-xs text-slate-400">Memuat Formulir Kendaraan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header & Back Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">
              {isEditMode ? `Edit Data Kendaraan: ${formData.licensePlate}` : 'Tambah Kendaraan Baru (Master Unit)'}
            </h1>
            <p className="text-xs text-slate-400">
              Isi spesifikasi lengkap, registrasi legalitas STNK/KIR, dan alokasi cabang operasional.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50 shadow-lg shadow-cyan-950/50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Daftarkan Kendaraan'}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('basic')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 transition-colors whitespace-nowrap ${
            activeTab === 'basic'
              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
          }`}
        >
          <Truck className="h-4 w-4" />
          1. Identitas Utama & Jenis
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('specs')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 transition-colors whitespace-nowrap ${
            activeTab === 'specs'
              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
          }`}
        >
          <Wrench className="h-4 w-4" />
          2. Spesifikasi Teknis & Mesin
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('legal')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 transition-colors whitespace-nowrap ${
            activeTab === 'legal'
              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
          }`}
        >
          <FileText className="h-4 w-4" />
          3. Legalitas STNK, KIR & Asuransi
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('org')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 transition-colors whitespace-nowrap ${
            activeTab === 'org'
              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
          }`}
        >
          <Building2 className="h-4 w-4" />
          4. Alokasi Cabang & Sensor GPS
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: BASIC INFORMATION */}
        {activeTab === 'basic' && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Truck className="h-4 w-4 text-cyan-400" />
              Identitas Utama Kendaraan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Kode Unit Kendaraan (Auto/Manual)
                </label>
                <input
                  type="text"
                  value={formData.vehicleCode || ''}
                  onChange={(e) => handleChange('vehicleCode', e.target.value)}
                  placeholder="e.g. VH-00124"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Kendaraan <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g. Toyota Dyna 130 HT Box"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Plat Nomor Polisi (Indonesia) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.licensePlate || ''}
                  onChange={(e) => handleChange('licensePlate', e.target.value.toUpperCase())}
                  placeholder="e.g. B 9482 UTX"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-mono font-bold uppercase text-cyan-300 bg-slate-950 focus:outline-none ${
                    plateError ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-500'
                  }`}
                  required
                />
                {plateError && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {plateError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Merek (Brand)</label>
                <input
                  type="text"
                  value={formData.brand || ''}
                  onChange={(e) => handleChange('brand', e.target.value)}
                  placeholder="e.g. Isuzu, Hino, Mitsubishi"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Model / Seri</label>
                <input
                  type="text"
                  value={formData.model || ''}
                  onChange={(e) => handleChange('model', e.target.value)}
                  placeholder="e.g. Ranger FL 235 JW"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Varian / Bodi</label>
                <input
                  type="text"
                  value={formData.variant || ''}
                  onChange={(e) => handleChange('variant', e.target.value)}
                  placeholder="e.g. Long Chassis Wingbox"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tipe Kendaraan</label>
                <select
                  value={formData.type || 'truck_box'}
                  onChange={(e) => handleChange('type', e.target.value as VehicleType)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="truck_box">Truk Box Alumunium</option>
                  <option value="truck_container">Truk Kontainer / Tronton</option>
                  <option value="truck_dump">Truk Dump / Karoseri</option>
                  <option value="van">Blind Van / Deliveries</option>
                  <option value="bus">Bus / Microbus Passenger</option>
                  <option value="pickup">Pick Up Kargo</option>
                  <option value="car">Mobil Operasional Passenger</option>
                  <option value="heavy_equipment">Alat Berat / Excavator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tahun Pembuatan</label>
                <input
                  type="number"
                  value={formData.year || 2024}
                  onChange={(e) => handleChange('year', parseInt(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Warna Bodi</label>
                <input
                  type="text"
                  value={formData.color || ''}
                  onChange={(e) => handleChange('color', e.target.value)}
                  placeholder="e.g. Putih - White"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Jenis Bahan Bakar</label>
                <select
                  value={formData.fuelType || 'biodiesel_b35'}
                  onChange={(e) => handleChange('fuelType', e.target.value as FuelType)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="biodiesel_b35">Solar / Biodiesel B35</option>
                  <option value="diesel">Diesel High Grade</option>
                  <option value="pertalite">Pertalite (RON 90)</option>
                  <option value="pertamax">Pertamax (RON 92)</option>
                  <option value="electric">EV Electric / Listrik</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Transmisi</label>
                <select
                  value={formData.transmission || 'manual'}
                  onChange={(e) => handleChange('transmission', e.target.value as TransmissionType)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="manual">Manual (MT)</option>
                  <option value="automatic">Automatic (AT)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Status Kepemilikan</label>
                <select
                  value={formData.ownership || 'company_owned'}
                  onChange={(e) => handleChange('ownership', e.target.value as OwnershipType)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="company_owned">Milik Sendiri (Perusahaan)</option>
                  <option value="leased">Sewa / Finance Lease</option>
                  <option value="rental">Rental Operasional</option>
                  <option value="third_party">Vendor Mitra (Third Party)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TECHNICAL SPECS */}
        {activeTab === 'specs' && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Wrench className="h-4 w-4 text-cyan-400" />
              Spesifikasi Teknis & Nomor Rangka/Mesin
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor VIN</label>
                <input
                  type="text"
                  value={formData.vin || ''}
                  onChange={(e) => handleChange('vin', e.target.value)}
                  placeholder="e.g. MHF1TR30928109231"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor Rangka (Chassis No)</label>
                <input
                  type="text"
                  value={formData.chassisNumber || ''}
                  onChange={(e) => handleChange('chassisNumber', e.target.value)}
                  placeholder="e.g. CHS-HINO-2024-001"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor Mesin (Engine No)</label>
                <input
                  type="text"
                  value={formData.engineNumber || ''}
                  onChange={(e) => handleChange('engineNumber', e.target.value)}
                  placeholder="e.g. ENG-J08E-UT201"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Kapasitas Mesin (CC)</label>
                <input
                  type="number"
                  value={formData.engineCapacityCc || 0}
                  onChange={(e) => handleChange('engineCapacityCc', parseInt(e.target.value))}
                  placeholder="e.g. 7684"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Kapasitas Tangki BBM (Liter)</label>
                <input
                  type="number"
                  value={formData.fuelCapacityLiters || 200}
                  onChange={(e) => handleChange('fuelCapacityLiters', parseFloat(e.target.value))}
                  placeholder="e.g. 200"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Payload Max (Kg)</label>
                <input
                  type="number"
                  value={formData.payloadKg || 0}
                  onChange={(e) => handleChange('payloadKg', parseInt(e.target.value))}
                  placeholder="e.g. 12000"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Gross Vehicle Weight / GVW (Kg)</label>
                <input
                  type="number"
                  value={formData.grossVehicleWeightKg || 0}
                  onChange={(e) => handleChange('grossVehicleWeightKg', parseInt(e.target.value))}
                  placeholder="e.g. 18000"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Jumlah Roda</label>
                <input
                  type="number"
                  value={formData.numberOfWheels || 6}
                  onChange={(e) => handleChange('numberOfWheels', parseInt(e.target.value))}
                  placeholder="e.g. 6"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ukuran Ban Standard</label>
                <input
                  type="text"
                  value={formData.tireSize || ''}
                  onChange={(e) => handleChange('tireSize', e.target.value)}
                  placeholder="e.g. 10.00-20 16PR"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Odometer Awal (KM)</label>
                <input
                  type="number"
                  value={formData.odometerKm || 0}
                  onChange={(e) => handleChange('odometerKm', parseFloat(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-cyan-300 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Engine Hours (Jam)</label>
                <input
                  type="number"
                  value={formData.engineHours || 0}
                  onChange={(e) => handleChange('engineHours', parseFloat(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-cyan-300 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LEGAL & REGISTRATION */}
        {activeTab === 'legal' && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" />
              Legalitas STNK, Uji KIR, Pajak & Asuransi (Indonesia Context)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor STNK</label>
                <input
                  type="text"
                  value={formData.stnkNumber || ''}
                  onChange={(e) => handleChange('stnkNumber', e.target.value)}
                  placeholder="e.g. STNK-0912384-1"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Masa Berlaku STNK</label>
                <input
                  type="date"
                  value={formData.stnkExpiry || ''}
                  onChange={(e) => handleChange('stnkExpiry', e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor BPKB</label>
                <input
                  type="text"
                  value={formData.bpkbNumber || ''}
                  onChange={(e) => handleChange('bpkbNumber', e.target.value)}
                  placeholder="e.g. BPKB-J821903-1"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor Uji KIR Dishub</label>
                <input
                  type="text"
                  value={formData.kirNumber || ''}
                  onChange={(e) => handleChange('kirNumber', e.target.value)}
                  placeholder="e.g. KIR-JABAR-92019-1"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Masa Berlaku KIR Dishub</label>
                <input
                  type="date"
                  value={formData.kirExpiry || ''}
                  onChange={(e) => handleChange('kirExpiry', e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Masa Jatuh Tempo Pajak Tahunan</label>
                <input
                  type="date"
                  value={formData.pajakExpiry || ''}
                  onChange={(e) => handleChange('pajakExpiry', e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Perusahaan Asuransi</label>
                <input
                  type="text"
                  value={formData.insuranceCompany || ''}
                  onChange={(e) => handleChange('insuranceCompany', e.target.value)}
                  placeholder="e.g. PT Asuransi Sinar Mas"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor Polis Asuransi</label>
                <input
                  type="text"
                  value={formData.insurancePolicyNumber || ''}
                  onChange={(e) => handleChange('insurancePolicyNumber', e.target.value)}
                  placeholder="e.g. POL-SM-2026-501"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Masa Berlaku Asuransi</label>
                <input
                  type="date"
                  value={formData.insuranceExpiry || ''}
                  onChange={(e) => handleChange('insuranceExpiry', e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ORG & ASSIGNMENT */}
        {activeTab === 'org' && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="h-4 w-4 text-cyan-400" />
              Alokasi Cabang, Grup Armada, Driver & Sensor GPS
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cabang / Depo Operasional</label>
                <select
                  value={formData.branchId || ''}
                  onChange={(e) => handleChange('branchId', e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Grup Armada (Vehicle Group)</label>
                <select
                  value={formData.groupId || ''}
                  onChange={(e) => handleChange('groupId', e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Departemen Pengelola</label>
                <select
                  value={formData.departmentId || ''}
                  onChange={(e) => handleChange('departmentId', e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Pengemudi Utama (Primary Driver)</label>
                <select
                  value={formData.primaryDriverId || ''}
                  onChange={(e) => handleChange('primaryDriverId', e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="">-- Belum Ditugaskan (Unassigned) --</option>
                  {drivers.map((drv) => (
                    <option key={drv.id} value={drv.id}>
                      {drv.name} ({drv.simType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Perangkat GPS Telematika</label>
                <select
                  value={formData.gpsDeviceId || ''}
                  onChange={(e) => handleChange('gpsDeviceId', e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  {gpsDevices.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.model} - IMEI: {g.imei} ({g.provider})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
          >
            Kembali
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50 shadow-lg shadow-cyan-950/50"
          >
            <Check className="h-4 w-4" />
            {isSaving ? 'Menyimpan Data...' : isEditMode ? 'Simpan Perubahan' : 'Daftarkan Unit Baru'}
          </button>
        </div>
      </form>
    </div>
  );
};
