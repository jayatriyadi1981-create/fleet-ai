/**
 * Fleet Intelligence Smart AI - Driver Creation & Edit Form Modal
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Building2,
  FileText,
  Phone,
  Mail,
  Calendar,
  Truck,
  AlertTriangle,
  Check,
  Clock,
} from 'lucide-react';
import {
  DriverExtended,
  EmploymentStatus,
  EmploymentType,
  LicenseType,
  OperationalAvailability,
} from '../../types/driver';
import { DriverService } from '../../services/driverService';

interface DriverFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverToEdit?: DriverExtended | null;
  onSuccess: (driver: DriverExtended) => void;
}

export const DriverFormModal: React.FC<DriverFormModalProps> = ({
  isOpen,
  onClose,
  driverToEdit,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'employment' | 'license' | 'assignment'>('personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [dateOfBirth, setDateOfBirth] = useState('1990-01-01');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const [branchId, setBranchId] = useState('br-jkt');
  const [branchName, setBranchName] = useState('HQ & Depo Jakarta (Tanjung Priok)');
  const [departmentId, setDepartmentId] = useState('dept-logistics');
  const [departmentName, setDepartmentName] = useState('Divisi Trans-Jawa Long Haul');
  const [position, setPosition] = useState('Heavy Truck Driver');
  const [status, setStatus] = useState<EmploymentStatus>('active');
  const [availabilityStatus, setAvailabilityStatus] = useState<OperationalAvailability>('available');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('permanent');
  const [joinDate, setJoinDate] = useState(new Date().toISOString().split('T')[0]);

  const [primaryLicenseNumber, setPrimaryLicenseNumber] = useState('');
  const [primaryLicenseType, setPrimaryLicenseType] = useState<LicenseType>('SIM B2 Umum');
  const [primaryLicenseExpiry, setPrimaryLicenseExpiry] = useState('2029-12-31');

  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRel, setEmergencyRel] = useState('Istri');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (driverToEdit) {
      setFullName(driverToEdit.fullName || '');
      setDisplayName(driverToEdit.displayName || '');
      setEmployeeId(driverToEdit.employeeId || '');
      setGender(driverToEdit.gender || 'male');
      setDateOfBirth(driverToEdit.dateOfBirth || '1990-01-01');
      setPhone(driverToEdit.phone || '');
      setEmail(driverToEdit.email || '');
      setAddress(driverToEdit.address || '');
      setBranchId(driverToEdit.branchId || 'br-jkt');
      setBranchName(driverToEdit.branchName || 'HQ & Depo Jakarta (Tanjung Priok)');
      setDepartmentId(driverToEdit.departmentId || 'dept-logistics');
      setDepartmentName(driverToEdit.departmentName || 'Divisi Trans-Jawa Long Haul');
      setPosition(driverToEdit.position || 'Heavy Truck Driver');
      setStatus(driverToEdit.status || 'active');
      setAvailabilityStatus(driverToEdit.availabilityStatus || 'available');
      setEmploymentType(driverToEdit.employmentType || 'permanent');
      setJoinDate(driverToEdit.joinDate || new Date().toISOString().split('T')[0]);
      setPrimaryLicenseNumber(driverToEdit.primaryLicenseNumber || '');
      setPrimaryLicenseType(driverToEdit.primaryLicenseType || 'SIM B2 Umum');
      setPrimaryLicenseExpiry(driverToEdit.primaryLicenseExpiry || '2029-12-31');
      setEmergencyName(driverToEdit.emergencyContact?.name || '');
      setEmergencyRel(driverToEdit.emergencyContact?.relationship || 'Istri');
      setEmergencyPhone(driverToEdit.emergencyContact?.phone || '');
      setNotes(driverToEdit.notes || '');
    } else {
      // Clear form
      setFullName('');
      setDisplayName('');
      setEmployeeId(`EMP-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      setGender('male');
      setDateOfBirth('1990-01-01');
      setPhone('+62 813 ');
      setEmail('');
      setAddress('');
      setStatus('active');
      setAvailabilityStatus('available');
      setPrimaryLicenseNumber('9203' + Math.floor(100000000 + Math.random() * 900000000));
      setEmergencyName('');
      setEmergencyPhone('+62 812 ');
      setNotes('');
    }
  }, [driverToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Nama Lengkap Wajib Diisi.');
      return;
    }
    if (!primaryLicenseNumber.trim()) {
      setError('Nomor SIM Wajib Diisi.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: Partial<DriverExtended> = {
        fullName,
        displayName: displayName || fullName.split(' ')[0],
        employeeId,
        gender,
        dateOfBirth,
        phone,
        email,
        address,
        branchId,
        branchName,
        departmentId,
        departmentName,
        position,
        status,
        availabilityStatus,
        employmentType,
        joinDate,
        primaryLicenseNumber,
        primaryLicenseType,
        primaryLicenseExpiry,
        emergencyContact: {
          name: emergencyName,
          relationship: emergencyRel,
          phone: emergencyPhone,
        },
        notes,
      };

      let result: DriverExtended;
      if (driverToEdit) {
        result = await DriverService.updateDriver(driverToEdit.id, payload);
      } else {
        result = await DriverService.createDriver(payload);
      }

      onSuccess(result);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data pengemudi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              {driverToEdit ? `Edit Data Driver - ${driverToEdit.driverCode}` : 'Pendaftaran Pengemudi Baru'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Isi data identitas, lisensi SIM, alokasi cabang, dan kontak darurat pengemudi armada.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/30 px-6 pt-2">
          {[
            { id: 'personal', label: '1. Identitas Personal', icon: User },
            { id: 'employment', label: '2. Kepegawaian & Cabang', icon: Building2 },
            { id: 'license', label: '3. Lisensi & SIM', icon: ShieldCheck },
            { id: 'assignment', label: '4. Kontak & Catatan', icon: Phone },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 rounded-lg flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sutrisno Hartono"
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Panggilan / Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Pak Sutrisno"
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  NIP / Employee ID
                </label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Jenis Kelamin
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="male">Laki-laki (Male)</option>
                  <option value="female">Perempuan (Female)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 813 xxxx xxxx"
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Operasional
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="driver.name@translogistik.co.id"
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Alamat Domisili KTP
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Jl. Merdeka No. 45, Duren Sawit, Jakarta Timur..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'employment' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cabang / Depo
                </label>
                <select
                  value={branchId}
                  onChange={(e) => {
                    setBranchId(e.target.value);
                    if (e.target.value === 'br-jkt') setBranchName('HQ & Depo Jakarta (Tanjung Priok)');
                    if (e.target.value === 'br-ckr') setBranchName('Hub Logistik Cikarang Dry Port');
                    if (e.target.value === 'br-sby') setBranchName('Depo Surabaya (Tanjung Perak)');
                    if (e.target.value === 'br-mkn') setBranchName('Cabang Makassar (Soekarno-Hatta Port)');
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="br-jkt">HQ & Depo Jakarta (Tanjung Priok)</option>
                  <option value="br-ckr">Hub Logistik Cikarang Dry Port</option>
                  <option value="br-sby">Depo Surabaya (Tanjung Perak)</option>
                  <option value="br-mkn">Cabang Makassar (Soekarno-Hatta Port)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Departemen Operasional
                </label>
                <select
                  value={departmentId}
                  onChange={(e) => {
                    setDepartmentId(e.target.value);
                    if (e.target.value === 'dept-logistics') setDepartmentName('Divisi Trans-Jawa Long Haul');
                    if (e.target.value === 'dept-cargo') setDepartmentName('Divisi Heavy Haulage');
                    if (e.target.value === 'dept-distribution') setDepartmentName('Express Distribution');
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="dept-logistics">Divisi Trans-Jawa Long Haul</option>
                  <option value="dept-cargo">Divisi Heavy Haulage</option>
                  <option value="dept-distribution">Express Distribution</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Jabatan / Position
                </label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g. Senior Heavy Truck Driver"
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status Kepegawaian
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="permanent">Tetap (Permanent)</option>
                  <option value="contract">Kontrak (Contract)</option>
                  <option value="outsourced">Outsourced</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status Operasional
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="active">Active (Aktif)</option>
                  <option value="inactive">Inactive (Non-Aktif)</option>
                  <option value="on_leave">Cuti (On Leave)</option>
                  <option value="suspended">Suspended (Skorsing)</option>
                  <option value="resigned">Resigned</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ketersediaan Tugas (Availability)
                </label>
                <select
                  value={availabilityStatus}
                  onChange={(e) => setAvailabilityStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="available">Available (Siap Tugas)</option>
                  <option value="assigned">Assigned (Ditugaskan)</option>
                  <option value="on_trip">On Trip (Dalam Perjalanan)</option>
                  <option value="off_duty">Off Duty (Istirahat)</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tanggal Bergabung (Join Date)
                </label>
                <input
                  type="date"
                  value={joinDate}
                  onChange={(e) => setJoinDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'license' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-lg text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Verifikasi Lisensi SIM Mengemudi:</strong>
                  <p className="mt-0.5">
                    Data SIM utama akan digunakan untuk validasi kelayakan mengemudikan kendaraan berat dan otomatisasi peringatan kedaluwarsa.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor SIM Utama *
                </label>
                <input
                  type="text"
                  value={primaryLicenseNumber}
                  onChange={(e) => setPrimaryLicenseNumber(e.target.value)}
                  placeholder="e.g. 9203182390123"
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Golongan SIM
                </label>
                <select
                  value={primaryLicenseType}
                  onChange={(e) => setPrimaryLicenseType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="SIM B2 Umum">SIM B2 Umum (Tronton & Trailer Heavy)</option>
                  <option value="SIM B1 Umum">SIM B1 Umum (Bus & Truk Sedang)</option>
                  <option value="SIM B2">SIM B2 (Alat Berat & Tractor Head)</option>
                  <option value="SIM B1">SIM B1 (Truk Engkel / Box)</option>
                  <option value="SIM A Umum">SIM A Umum (Van & Minibus Commercial)</option>
                  <option value="SIM A">SIM A (Mobil Penumpang)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Masa Berlaku SIM
                </label>
                <input
                  type="date"
                  value={primaryLicenseExpiry}
                  onChange={(e) => setPrimaryLicenseExpiry(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'assignment' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2">
                  Kontak Darurat (Emergency Contact)
                </h4>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Kontak Darurat
                </label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="e.g. Dewi Ratnasari"
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hubungan Keluarga
                </label>
                <input
                  type="text"
                  value={emergencyRel}
                  onChange={(e) => setEmergencyRel(e.target.value)}
                  placeholder="e.g. Istri / Suami / Orang Tua"
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Telepon Kontak Darurat
                </label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="+62 812 xxxx xxxx"
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Rekomendasi HR & Operasional
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan sertifikasi khusus, batasan rute, atau preferensi armada..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Batal
            </button>

            <div className="flex items-center gap-2">
              {activeTab !== 'personal' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'employment') setActiveTab('personal');
                    if (activeTab === 'license') setActiveTab('employment');
                    if (activeTab === 'assignment') setActiveTab('license');
                  }}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Kembali
                </button>
              )}

              {activeTab !== 'assignment' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'personal') setActiveTab('employment');
                    if (activeTab === 'employment') setActiveTab('license');
                    if (activeTab === 'license') setActiveTab('assignment');
                  }}
                  className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  Lanjut
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {driverToEdit ? 'Simpan Perubahan' : 'Daftarkan Pengemudi'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
