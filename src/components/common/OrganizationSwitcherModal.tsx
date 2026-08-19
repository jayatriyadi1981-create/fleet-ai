/**
 * Fleet Intelligence Smart AI - Multi-Tenant Organization Switcher Modal
 * Enables enterprise switching between tenants, refreshing scope and data context
 */

import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
import { useOrganization } from '../../context/OrganizationContext';
import { useToast } from '../ui/Toast';
import { Building2, Check, ArrowRight, X, Shield, MapPin, Truck } from 'lucide-react';

export const OrganizationSwitcherModal: React.FC = () => {
  const { isOrganizationModalOpen, setIsOrganizationModalOpen, setCurrentTenant } = useFleet();
  const { tenants, currentTenant, switchTenant, isLoading } = useOrganization();
  const { showSuccess } = useToast();
  const [selectedTenantId, setSelectedTenantId] = useState<string>(currentTenant.id);
  const [isSwitchingLocal, setIsSwitchingLocal] = useState<boolean>(false);

  if (!isOrganizationModalOpen) return null;

  const handleConfirmSwitch = async () => {
    const found = tenants.find((t) => t.id === selectedTenantId);
    if (!found) return;

    setIsSwitchingLocal(true);
    const success = await switchTenant(selectedTenantId);
    if (success) {
      // Sync legacy FleetContext tenant structure
      setCurrentTenant({
        id: found.id,
        name: found.name,
        code: found.code,
        taxIdNpwp: found.taxIdNpwp,
        address: found.address,
        phone: found.phone,
        email: found.email,
        branchesCount: found.branchesCount,
        vehiclesCount: found.vehiclesCount,
        subscriptionPlan: found.subscriptionPlan,
        status: found.status === 'suspended' ? 'suspended' : found.status === 'trial' ? 'trial' : 'active',
      });
      setIsOrganizationModalOpen(false);
    }
    setIsSwitchingLocal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Switch Perusahaan & Tenant</h3>
              <p className="text-xs text-slate-400">Pilih entitas organisasi armada yang ingin diakses.</p>
            </div>
          </div>
          <button
            onClick={() => setIsOrganizationModalOpen(false)}
            className="p-1.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {tenants.map((t) => {
            const isCurrent = currentTenant.id === t.id;
            const isSelected = selectedTenantId === t.id;

            return (
              <div
                key={t.id}
                onClick={() => setSelectedTenantId(t.id)}
                className={`relative flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/30 text-white shadow-lg shadow-cyan-950/40'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold text-sm border ${
                    isSelected ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-900 text-cyan-400 border-slate-800'
                  }`}>
                    {t.name.charAt(3) || 'P'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">{t.name}</h4>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">({t.code})</span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                      <span>{t.subscriptionPlan} Tier</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Truck className="h-3 w-3 text-cyan-400" />
                        {t.vehiclesCount || t.limits?.currentVehicles || 0} Unit
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-500" />
                        {t.city || 'Indonesia'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected && <Check className="h-5 w-5 text-cyan-400 shrink-0" />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl bg-slate-950 p-3 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
          <Shield className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
          <p>
            Mengubah tenant akan secara otomatis memuat ulang otorisasi RBAC, daftar armada, geofence, dan laporan yang relevan dengan perusahaan pilihan secara terisolasi (Row-Level Security).
          </p>
        </div>

        <div className="pt-2 flex justify-end gap-2.5">
          <button
            onClick={() => setIsOrganizationModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Batal
          </button>
          <button
            onClick={handleConfirmSwitch}
            disabled={isSwitchingLocal || isLoading || selectedTenantId === currentTenant.id}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950 transition-colors"
          >
            {isSwitchingLocal || isLoading ? (
              <span>Memuat Ulang Tenant...</span>
            ) : (
              <>
                <span>Ganti Ke Tenant Pilihan</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
