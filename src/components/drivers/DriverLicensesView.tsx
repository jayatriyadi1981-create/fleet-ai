/**
 * Fleet Intelligence Smart AI - SIM & Licenses Dedicated Management View
 * Tracks SIM expiry count, verification state, Polda issuance authority, and masking privacy controls
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Eye,
  EyeOff,
  Plus,
  CheckCircle2,
  Clock,
  Building2,
  Search,
  FileCheck,
} from 'lucide-react';
import { DriverExtended, DriverLicense } from '../../types/driver';
import { DriverService, maskSensitiveData } from '../../services/driverService';

interface DriverLicensesViewProps {
  onSelectDriver: (driverId: string) => void;
}

export const DriverLicensesView: React.FC<DriverLicensesViewProps> = ({ onSelectDriver }) => {
  const [drivers, setDrivers] = useState<DriverExtended[]>([]);
  const [licenses, setLicenses] = useState<DriverLicense[]>([]);
  const [showSensitive, setShowSensitive] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // New License Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetDriverId, setTargetDriverId] = useState('');
  const [licNumber, setLicNumber] = useState('');
  const [licType, setLicType] = useState('SIM B2 Umum');
  const [licAuthority, setLicAuthority] = useState('Polda Metro Jaya');
  const [licExpiry, setLicExpiry] = useState('2029-12-31');

  const fetchData = async () => {
    const drvList = await DriverService.listDrivers({ page: 1, pageSize: 50 });
    setDrivers(drvList.drivers);

    const allLicenses: DriverLicense[] = [];
    for (const d of drvList.drivers) {
      const lics = await DriverService.getLicensesByDriver(d.driverId);
      allLicenses.push(...lics);
    }
    setLicenses(allLicenses);
    if (drvList.drivers.length > 0) setTargetDriverId(drvList.drivers[0].driverId);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddLicenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDriverId || !licNumber) return;

    await DriverService.addLicense({
      driverId: targetDriverId,
      licenseNumber: licNumber,
      licenseType: licType as any,
      issuingAuthority: licAuthority,
      expiryDate: licExpiry,
      status: 'valid',
    });

    setIsModalOpen(false);
    setLicNumber('');
    fetchData();
  };

  const expiredCount = licenses.filter((l) => l.status === 'expired').length;
  const expiringCount = licenses.filter((l) => l.status === 'expiring_soon').length;

  return (
    <div className="space-y-6">
      {/* Expiry Warning Banners */}
      {(expiredCount > 0 || expiringCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expiredCount > 0 && (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl p-4 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200 uppercase tracking-wider">
                  {expiredCount} SIM Kedaluwarsa (Expired)
                </h4>
                <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">
                  Driver dengan SIM kedaluwarsa secara otomatis dinonaktifkan dari penugasan jalan untuk menjaga kepatuhan hukum.
                </p>
              </div>
            </div>
          )}

          {expiringCount > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                  {expiringCount} SIM Segera Kedaluwarsa (&lt; 30 Hari)
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  Kirimkan notifikasi peringatan perpanjangan SIM ke pengemudi melalui pesan operasional.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Filter Status SIM:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="all">Semua SIM</option>
            <option value="valid">SIM Valid</option>
            <option value="expiring_soon">Expiring Soon</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSensitive(!showSensitive)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 transition-colors"
          >
            {showSensitive ? <EyeOff className="w-4 h-4 text-amber-500" /> : <Eye className="w-4 h-4 text-indigo-500" />}
            <span>{showSensitive ? 'Mask Nomor SIM' : 'Tampilkan Nomor SIM'}</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah SIM Baru</span>
          </button>
        </div>
      </div>

      {/* Licenses Master Grid Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Katalog Lisensi SIM Pengemudi
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-3">Golongan SIM</th>
                <th className="px-4 py-3">Nomor SIM</th>
                <th className="px-4 py-3">Pengemudi Pemilik</th>
                <th className="px-4 py-3">Polda Penerbit</th>
                <th className="px-4 py-3">Masa Berlaku</th>
                <th className="px-4 py-3">Status Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {licenses
                .filter((l) => (filterStatus === 'all' ? true : l.status === filterStatus))
                .map((lic) => {
                  const owner = drivers.find((d) => d.driverId === lic.driverId);
                  return (
                    <tr key={lic.licenseId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900 dark:text-slate-100 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                          {lic.licenseType}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-mono text-slate-800 dark:text-slate-200 font-semibold">
                        {maskSensitiveData(lic.licenseNumber, showSensitive)}
                      </td>

                      <td className="px-4 py-3">
                        {owner ? (
                          <button
                            onClick={() => onSelectDriver(owner.driverId)}
                            className="font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 text-left block"
                          >
                            {owner.fullName}
                          </button>
                        ) : (
                          <span className="text-slate-400 italic">Unknown</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {lic.issuingAuthority || 'Polda Metro Jaya'}
                      </td>

                      <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">
                        {lic.expiryDate}
                      </td>

                      <td className="px-4 py-3">
                        {lic.status === 'valid' && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" /> Verifikasi Polda
                          </span>
                        )}
                        {lic.status === 'expiring_soon' && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-full flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" /> Expiring Soon
                          </span>
                        )}
                        {lic.status === 'expired' && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 rounded-full flex items-center gap-1 w-fit">
                            <ShieldAlert className="w-3 h-3" /> Expired
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add SIM Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Registrasi SIM Baru Pengemudi
            </h3>

            <form onSubmit={handleAddLicenseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Pilih Pengemudi
                </label>
                <select
                  value={targetDriverId}
                  onChange={(e) => setTargetDriverId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {drivers.map((d) => (
                    <option key={d.driverId} value={d.driverId}>
                      {d.fullName} ({d.driverCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Nomor SIM *
                </label>
                <input
                  type="text"
                  required
                  value={licNumber}
                  onChange={(e) => setLicNumber(e.target.value)}
                  placeholder="e.g. 9203182390123"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Golongan SIM
                </label>
                <select
                  value={licType}
                  onChange={(e) => setLicType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="SIM B2 Umum">SIM B2 Umum</option>
                  <option value="SIM B1 Umum">SIM B1 Umum</option>
                  <option value="SIM B2">SIM B2</option>
                  <option value="SIM B1">SIM B1</option>
                  <option value="SIM A Umum">SIM A Umum</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Polda Penerbit
                </label>
                <input
                  type="text"
                  value={licAuthority}
                  onChange={(e) => setLicAuthority(e.target.value)}
                  placeholder="e.g. Polda Metro Jaya"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Masa Berlaku (Expiry Date)
                </label>
                <input
                  type="date"
                  value={licExpiry}
                  onChange={(e) => setLicExpiry(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Simpan SIM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
