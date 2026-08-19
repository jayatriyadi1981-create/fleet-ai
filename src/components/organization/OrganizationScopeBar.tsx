/**
 * Fleet Intelligence Smart AI - Multi-Tenant Organization Scope Bar
 * Provides instant multi-level filtering (Tenant > Branch > Department > Fleet) with live counts
 */

import React from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Truck, 
  RotateCcw, 
  Layers, 
  ChevronRight, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const OrganizationScopeBar: React.FC = () => {
  const {
    currentTenant,
    branches,
    departments,
    fleets,
    selectedBranchId,
    selectedDepartmentId,
    selectedFleetId,
    setSelectedBranchId,
    setSelectedDepartmentId,
    setSelectedFleetId,
    resetScopeFilters,
    orgTree
  } = useOrganization();

  const isFiltered = selectedBranchId !== 'all' || selectedDepartmentId !== 'all' || selectedFleetId !== 'all';

  // Filter available departments based on selected branch
  const availableDepartments = selectedBranchId === 'all' 
    ? departments 
    : departments.filter(d => d.branchId === selectedBranchId);

  // Filter available fleets based on selected branch and department
  const availableFleets = fleets.filter(f => {
    if (selectedBranchId !== 'all' && f.branchId !== selectedBranchId) return false;
    if (selectedDepartmentId !== 'all' && f.departmentId !== selectedDepartmentId) return false;
    return true;
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 backdrop-blur-md shadow-lg shadow-slate-950/50 mb-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Scope Breadcrumb & Active Tenant Details */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
            <Building2 className="h-4 w-4 text-cyan-400 shrink-0" />
            <span className="truncate max-w-[180px]">{currentTenant.name}</span>
            <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-[10px] font-mono text-cyan-400 border border-cyan-800/60">
              {currentTenant.code}
            </span>
          </div>

          <ChevronRight className="h-4 w-4 text-slate-600 hidden sm:block" />

          {/* Active Scope Summary */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1 font-medium text-slate-300">
              <Layers className="h-3.5 w-3.5 text-slate-500" />
              Scope Otorisasi:
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px]">
              {selectedBranchId === 'all' ? 'Semua Cabang' : branches.find(b => b.id === selectedBranchId)?.name || selectedBranchId}
            </span>
            {selectedDepartmentId !== 'all' && (
              <>
                <span className="text-slate-600">/</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px]">
                  {departments.find(d => d.id === selectedDepartmentId)?.name || selectedDepartmentId}
                </span>
              </>
            )}
            {selectedFleetId !== 'all' && (
              <>
                <span className="text-slate-600">/</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px]">
                  {fleets.find(f => f.id === selectedFleetId)?.name || selectedFleetId}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Dropdown Filters & Reset Scope */}
        <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto justify-end">
          {/* Branch Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
            <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <select
              value={selectedBranchId}
              onChange={(e) => {
                setSelectedBranchId(e.target.value);
                setSelectedDepartmentId('all');
                setSelectedFleetId('all');
              }}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-slate-900 text-slate-200">Semua Cabang / Depo</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id} className="bg-slate-900 text-slate-200">
                  {b.name} ({b.vehiclesCount} Unit)
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
            <Briefcase className="h-3.5 w-3.5 text-blue-400 shrink-0" />
            <select
              value={selectedDepartmentId}
              onChange={(e) => {
                setSelectedDepartmentId(e.target.value);
                setSelectedFleetId('all');
              }}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-slate-900 text-slate-200">Semua Departemen</option>
              {availableDepartments.map((d) => (
                <option key={d.id} value={d.id} className="bg-slate-900 text-slate-200">
                  {d.name} ({d.vehiclesCount} Unit)
                </option>
              ))}
            </select>
          </div>

          {/* Fleet Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
            <Truck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <select
              value={selectedFleetId}
              onChange={(e) => setSelectedFleetId(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-slate-900 text-slate-200">Semua Grup Armada</option>
              {availableFleets.map((f) => (
                <option key={f.id} value={f.id} className="bg-slate-900 text-slate-200">
                  {f.name} ({f.vehiclesCount} Unit)
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          {isFiltered && (
            <button
              onClick={resetScopeFilters}
              title="Reset ke Scope Seluruh Perusahaan"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}

          <div className="hidden xl:flex items-center gap-1.5 pl-2 border-l border-slate-800 text-[11px] font-mono text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>RLS Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
