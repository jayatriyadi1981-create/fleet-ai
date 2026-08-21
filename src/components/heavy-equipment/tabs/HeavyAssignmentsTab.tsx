import React, { useState } from 'react';
import { 
  Briefcase, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  User, 
  Truck, 
  MapPin, 
  Layers, 
  Filter, 
  ShieldAlert,
  Search
} from 'lucide-react';
import { 
  EquipmentAssignment, 
  HeavyEquipmentAsset, 
  ConstructionProject, 
  HeavyOperatorProfile,
  ConstructionSite 
} from '../../../modules/heavy-equipment/types';

interface Props {
  assignments: EquipmentAssignment[];
  equipments: HeavyEquipmentAsset[];
  projects: ConstructionProject[];
  sites: ConstructionSite[];
  operators: HeavyOperatorProfile[];
  onAssign: (asg: Partial<EquipmentAssignment>) => { success: boolean; message: string; assignment?: EquipmentAssignment };
}

export const HeavyAssignmentsTab: React.FC<Props> = ({
  assignments,
  equipments,
  projects,
  sites,
  operators,
  onAssign
}) => {
  const [showModal, setShowModal] = useState(false);
  const [filterProject, setFilterProject] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    equipmentId: equipments[0]?.id || '',
    projectId: projects[0]?.id || '',
    siteId: sites[0]?.id || '',
    operatorId: operators[0]?.id || '',
    workArea: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    shift: 'SHIFT_1_DAY',
    targetHours: 200,
    targetProductivity: '150 BCM / Shift',
    notes: ''
  });

  const filteredAssignments = assignments.filter(a => {
    const matchPrj = filterProject === 'ALL' || a.projectId === filterProject;
    const matchSearch = a.equipmentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.workArea.toLowerCase().includes(searchTerm.toLowerCase());
    return matchPrj && matchSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selEq = equipments.find(eq => eq.id === formData.equipmentId);
    const selPrj = projects.find(p => p.id === formData.projectId);
    const selSite = sites.find(s => s.id === formData.siteId);
    const selOp = operators.find(o => o.id === formData.operatorId);

    const result = onAssign({
      equipmentId: formData.equipmentId,
      equipmentCode: selEq?.code || '',
      equipmentName: selEq?.name || '',
      projectId: formData.projectId,
      projectName: selPrj?.name || '',
      siteId: formData.siteId,
      siteName: selSite?.name || '',
      operatorId: formData.operatorId,
      operatorName: selOp?.name || '',
      workArea: formData.workArea || 'General Job Site Area',
      startDate: formData.startDate,
      endDate: formData.endDate,
      shift: formData.shift as any,
      targetHours: Number(formData.targetHours),
      targetProductivity: formData.targetProductivity,
      notes: formData.notes
    });

    if (result.success) {
      setAlertMessage({ type: 'success', text: result.message });
      setShowModal(false);
    } else {
      setAlertMessage({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {alertMessage && (
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm font-medium ${
          alertMessage.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {alertMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            <span>{alertMessage.text}</span>
          </div>
          <button 
            onClick={() => setAlertMessage(null)}
            className="text-xs underline hover:opacity-80"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-500" />
            Alokasi Penugasan Alat Berat & Operator (Assignment)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Penjadwalan unit ke proyek & job site dengan validasi pencegahan *Double Assignment* serta verifikasi kesiapan alat dan lisensi operator.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Terbitkan Assignment Baru
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">Total Penugasan Aktif</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {assignments.filter(a => a.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">Alat Teralokasi</span>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {equipments.filter(e => e.status === 'WORKING' || e.status === 'ASSIGNED').length} <span className="text-xs text-slate-400 font-normal">/ {equipments.length} Unit</span>
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">Operator Bertugas</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {operators.filter(o => o.assignedEquipmentCode).length} <span className="text-xs text-slate-400 font-normal">/ {operators.length} Orang</span>
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">Kepatuhan Alokasi</span>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            100% <span className="text-xs text-slate-400 font-normal">Zero Double-Booking</span>
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kode alat, operator, proyek..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs bg-transparent border-none focus:outline-none w-full sm:w-64 text-slate-800 dark:text-slate-200"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">Semua Proyek Aktif</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Assignment Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Kode & Alat</th>
                <th className="p-3.5">Proyek & Job Site</th>
                <th className="p-3.5">Work Area / Tugas</th>
                <th className="p-3.5">Operator</th>
                <th className="p-3.5">Periode & Shift</th>
                <th className="p-3.5">Target</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
              {filteredAssignments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{a.equipmentCode}</span>
                        <span className="text-[11px] text-slate-500">{a.equipmentName}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold text-slate-900 dark:text-white block">{a.projectName}</span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {a.siteName}
                    </span>
                  </td>
                  <td className="p-3.5 max-w-[200px]">
                    <span className="text-slate-800 dark:text-slate-200 block truncate">{a.workArea}</span>
                    {a.notes && <span className="text-[10px] text-slate-400 block truncate italic">{a.notes}</span>}
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-500" />
                      {a.operatorName}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="text-slate-800 dark:text-slate-200 block">{a.startDate} s/d {a.endDate}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold inline-block mt-0.5">
                      {a.shift === 'SHIFT_1_DAY' ? 'Shift Siang (07:00 - 18:00)' : 'Shift Malam (19:00 - 06:00)'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 dark:text-white block">{a.targetHours} HM</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium block">{a.targetProductivity}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Form Terbitkan Assignment Baru */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-500" />
                Terbitkan Alokasi Penugasan Alat Baru
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Pilih Unit Alat Berat</label>
                  <select
                    value={formData.equipmentId}
                    onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {equipments.map(eq => (
                      <option key={eq.id} value={eq.id}>
                        {eq.code} - {eq.name} ({eq.status})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Pilih Operator</label>
                  <select
                    value={formData.operatorId}
                    onChange={(e) => setFormData({ ...formData, operatorId: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {operators.map(op => (
                      <option key={op.id} value={op.id}>
                        {op.name} ({op.sioClass})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Proyek</label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Job Site</label>
                  <select
                    value={formData.siteId}
                    onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {sites.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Work Area / Spesifikasi Pekerjaan</label>
                <input
                  type="text"
                  placeholder="Contoh: Main Cut & Fill STA 12+500"
                  value={formData.workArea}
                  onChange={(e) => setFormData({ ...formData, workArea: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Tanggal Selesai</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Target HM</label>
                  <input
                    type="number"
                    value={formData.targetHours}
                    onChange={(e) => setFormData({ ...formData, targetHours: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md"
                >
                  Simpan & Terbitkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
