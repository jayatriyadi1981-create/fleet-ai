import React, { useState } from 'react';
import {
  KeyRound,
  Plus,
  RotateCw,
  Trash2,
  Copy,
  Check,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Globe,
  Clock,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { APIKeyRecord, ApiScope, ApiEnvironment, API_SCOPE_DEFINITIONS } from '../../../types/externalApi';
import { apiKeyService } from '../../../services/api/apiKeyService';
import { useFleet } from '../../../context/FleetContext';

interface ApiKeysTabProps {
  apiKeys: APIKeyRecord[];
  onRefresh: () => void;
}

export const ApiKeysTab: React.FC<ApiKeysTabProps> = ({ apiKeys, onRefresh }) => {
  const { currentTenant, currentUser } = useFleet();
  const [filterEnv, setFilterEnv] = useState<'ALL' | ApiEnvironment>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyDesc, setNewKeyDesc] = useState('');
  const [newKeyEnv, setNewKeyEnv] = useState<ApiEnvironment>('PRODUCTION');
  const [newKeyExpiryDays, setNewKeyExpiryDays] = useState(365);
  const [newKeyIpRestrictions, setNewKeyIpRestrictions] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<ApiScope[]>([
    'vehicles:read',
    'drivers:read',
    'gps:read',
    'trips:read',
    'alerts:read',
  ]);

  // Newly created secret popup (shown ONCE)
  const [createdSecret, setCreatedSecret] = useState<{ rawKey: string; keyName: string } | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Rotate / Revoke confirmation modal
  const [confirmModal, setConfirmModal] = useState<{
    type: 'ROTATE' | 'REVOKE';
    key: APIKeyRecord;
  } | null>(null);

  const filteredKeys = apiKeys.filter(k => {
    const matchesEnv = filterEnv === 'ALL' || k.environment === filterEnv;
    const matchesSearch = k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          k.maskedKey.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEnv && matchesSearch;
  });

  const handleToggleScope = (scope: ApiScope) => {
    setSelectedScopes(prev =>
      prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]
    );
  };

  const handleSelectAllCategory = (category: string) => {
    const categoryScopes = API_SCOPE_DEFINITIONS.filter(s => s.category === category).map(s => s.scope);
    const allSelected = categoryScopes.every(s => selectedScopes.includes(s));
    if (allSelected) {
      setSelectedScopes(prev => prev.filter(s => !categoryScopes.includes(s)));
    } else {
      setSelectedScopes(prev => Array.from(new Set([...prev, ...categoryScopes])));
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const ips = newKeyIpRestrictions
      ? newKeyIpRestrictions.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    const res = await apiKeyService.createKey({
      tenantId: currentTenant.id,
      tenantName: currentTenant.name,
      name: newKeyName.trim(),
      description: newKeyDesc.trim() || undefined,
      scopes: selectedScopes,
      environment: newKeyEnv,
      ipRestrictions: ips,
      expiresInDays: newKeyExpiryDays,
      createdBy: currentUser?.name || 'Administrator',
    });

    setIsCreateModalOpen(false);
    setNewKeyName('');
    setNewKeyDesc('');
    setCreatedSecret({ rawKey: res.rawSecretKey, keyName: res.record.name });
    onRefresh();
  };

  const handleConfirmAction = async () => {
    if (!confirmModal) return;
    if (confirmModal.type === 'REVOKE') {
      apiKeyService.revokeKey(confirmModal.key.id);
      setConfirmModal(null);
      onRefresh();
    } else if (confirmModal.type === 'ROTATE') {
      const res = await apiKeyService.rotateKey(confirmModal.key.id, currentUser?.name || 'Administrator');
      setConfirmModal(null);
      if (res) {
        setCreatedSecret({ rawKey: res.rawSecretKey, keyName: res.record.name });
      }
      onRefresh();
    }
  };

  const handleCopyRawSecret = () => {
    if (!createdSecret) return;
    navigator.clipboard.writeText(createdSecret.rawKey);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleCopyMasked = (key: APIKeyRecord) => {
    navigator.clipboard.writeText(key.keyPrefix);
    setCopiedKeyId(key.id);
    setTimeout(() => setCopiedKeyId(null), 1500);
  };

  const categories = Array.from(new Set(API_SCOPE_DEFINITIONS.map(s => s.category)));

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-cyan-400" />
            <span>Kredensial API Keys</span>
          </h3>
          <p className="text-slate-400 text-xs">
            Kelola kunci API terenkripsi SHA-256 untuk otorisasi external client ke Fleet Gateway.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Environment Filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {(['ALL', 'PRODUCTION', 'SANDBOX'] as const).map(env => (
              <button
                key={env}
                onClick={() => setFilterEnv(env)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filterEnv === env
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {env === 'ALL' ? 'Semua' : env}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Buat API Key Baru</span>
          </button>
        </div>
      </div>

      {/* API Keys Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama key atau prefix..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
          <span className="text-xs text-slate-400">
            Menampilkan <strong className="text-white">{filteredKeys.length}</strong> keys
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Nama & Environment</th>
                <th className="py-3.5 px-4">Kredensial Prefix</th>
                <th className="py-3.5 px-4">Scopes Diizinkan</th>
                <th className="py-3.5 px-4">Rate Limit</th>
                <th className="py-3.5 px-4">Terakhir Digunakan</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredKeys.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Tidak ada API Key yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredKeys.map(k => (
                  <tr key={k.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-white">{k.name}</div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            k.environment === 'PRODUCTION'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {k.environment}
                        </span>
                      </div>
                      {k.description && (
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">{k.description}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300">{k.maskedKey}</span>
                        <button
                          onClick={() => handleCopyMasked(k)}
                          title="Salin Prefix"
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
                        >
                          {copiedKeyId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {k.scopes.slice(0, 3).map(s => (
                          <span key={s} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-cyan-300 font-mono">
                            {s}
                          </span>
                        ))}
                        {k.scopes.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-800/60 text-[10px] text-slate-400">
                            +{k.scopes.length - 3} lainnya
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {k.rateLimitPerMin} req/min
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleString('id-ID') : 'Belum pernah'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          k.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : k.status === 'REVOKED'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        }`}
                      >
                        {k.status === 'ACTIVE' && <CheckCircle2 className="w-3 h-3" />}
                        {k.status === 'REVOKED' && <XCircle className="w-3 h-3" />}
                        <span>{k.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {k.status === 'ACTIVE' && (
                          <>
                            <button
                              onClick={() => setConfirmModal({ type: 'ROTATE', key: k })}
                              title="Rotate Kunci (Ganti Secret)"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition-all"
                            >
                              <RotateCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setConfirmModal({ type: 'REVOKE', key: k })}
                              title="Revoke / Nonaktifkan"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-rose-400 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE API KEY MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <span>Buat API Key Baru</span>
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateKey} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Kredensial *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="misal: SAP S/4HANA ERP Connector"
                    value={newKeyName}
                    onChange={e => setNewKeyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Environment Target
                  </label>
                  <select
                    value={newKeyEnv}
                    onChange={e => setNewKeyEnv(e.target.value as ApiEnvironment)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="PRODUCTION">Production (flt_live_...)</option>
                    <option value="SANDBOX">Sandbox (flt_test_...)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deskripsi / Catatan Integrasi
                </label>
                <input
                  type="text"
                  placeholder="Kebutuhan sinkronisasi master armada & live tracking"
                  value={newKeyDesc}
                  onChange={e => setNewKeyDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Scopes Selection */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Pilih Granular Scopes Permission</span>
                  </label>
                  <span className="text-[11px] text-cyan-400 font-semibold">
                    {selectedScopes.length} scopes dipilih
                  </span>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  {categories.map(cat => {
                    const catScopes = API_SCOPE_DEFINITIONS.filter(s => s.category === cat);
                    return (
                      <div key={cat} className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          <span>{cat}</span>
                          <button
                            type="button"
                            onClick={() => handleSelectAllCategory(cat)}
                            className="text-[10px] text-cyan-400 hover:underline lowercase font-normal"
                          >
                            toggle category
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {catScopes.map(item => {
                            const isChecked = selectedScopes.includes(item.scope);
                            return (
                              <label
                                key={item.scope}
                                className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                                  isChecked
                                    ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleScope(item.scope)}
                                  className="mt-0.5 accent-cyan-500"
                                />
                                <div>
                                  <div className="font-semibold text-xs flex items-center gap-1">
                                    <span>{item.label}</span>
                                    {item.isHighRisk && (
                                      <span className="px-1 py-0.2 rounded bg-rose-500/20 text-rose-400 text-[9px]">Sensitif</span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-400">{item.scope}</div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20"
                >
                  Generate API Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECRET POPUP (SHOWN ONCE) */}
      {createdSecret && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-emerald-400">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">API Key Berhasil Dibuat!</h3>
                <p className="text-xs text-slate-400">{createdSecret.keyName}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-amber-300 text-xs">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                <strong>PENTING:</strong> Simpan kunci rahasia ini sekarang di tempat aman. Kunci rahasia ini{' '}
                <strong>HANYA DITAMPILKAN SEKALI</strong> dan tidak dapat dilihat kembali demi keamanan enkripsi.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Raw Secret Key</label>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 select-all break-all">
                <span>{createdSecret.rawKey}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleCopyRawSecret}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all"
              >
                {copiedSecret ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSecret ? 'Kunci Berhasil Disalin!' : 'Salin Kunci Rahasia'}</span>
              </button>

              <button
                onClick={() => setCreatedSecret(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Saya Sudah Menyimpannya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM ROTATE / REVOKE MODAL */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${confirmModal.type === 'REVOKE' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
                {confirmModal.type === 'REVOKE' ? <Trash2 className="w-5 h-5" /> : <RotateCw className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {confirmModal.type === 'REVOKE' ? 'Konfirmasi Revoke API Key' : 'Konfirmasi Rotasi Kunci'}
                </h3>
                <p className="text-xs text-slate-400">{confirmModal.key.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {confirmModal.type === 'REVOKE'
                ? 'Apakah Anda yakin ingin me-revoke kunci ini? Semua integrasi yang menggunakan kunci ini akan langsung ditolak (HTTP 401).'
                : 'Rotasi kunci akan men-generate secret baru dan menonaktifkan secret lama. Anda harus meng-update kredensial di sistem ERP/TMS Anda.'}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${
                  confirmModal.type === 'REVOKE'
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {confirmModal.type === 'REVOKE' ? 'Ya, Revoke Kunci' : 'Lakukan Rotasi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
