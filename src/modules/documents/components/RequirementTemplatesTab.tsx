/**
 * Fleet Intelligence Smart AI - Document Requirement Templates & Category Rules
 * PROMPT 48 - Mandatory Compliance Rule Matrices, Renewal Windows & Operational Restrictions
 */

import React, { useState } from 'react';
import {
  Layers,
  ShieldCheck,
  Plus,
  Truck,
  UserCheck,
  Building,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Settings2,
} from 'lucide-react';
import { documentComplianceEngine } from '../services/documentComplianceEngine';
import { DocumentRequirementTemplate } from '../types/documentTypes';

export const RequirementTemplatesTab: React.FC = () => {
  const [templates, setTemplates] = useState<DocumentRequirementTemplate[]>(
    documentComplianceEngine.getTemplates()
  );
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentRequirementTemplate | null>(templates[0] || null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Matriks Kategori & Dokumen Wajib Kepatuhan</h2>
            <p className="text-xs text-slate-400">
              Konfigurasi standar legalitas wajib per kategori armada & pengemudi sesuai regulasi Kemenhub RI
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((tpl) => {
          const isSelected = selectedTemplate?.id === tpl.id;
          return (
            <div
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl)}
              className={`cursor-pointer rounded-2xl border p-4 transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-950/40'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-cyan-300 font-mono">
                    {tpl.code}
                  </span>
                  <span className="text-[11px] text-slate-400">{tpl.activeUnitCount} Unit Aktif</span>
                </div>

                <h3 className="text-xs font-bold text-white">{tpl.name}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2">{tpl.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{tpl.requiredDocuments.length} Dokumen Standar</span>
                <span className="text-cyan-400 font-semibold">Lihat Matriks →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Template Inspector */}
      {selectedTemplate && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{selectedTemplate.name}</h3>
                <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-bold text-cyan-300">
                  {selectedTemplate.entityType}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Target Entitas: <span className="text-white">{selectedTemplate.targetDescription}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                <ShieldCheck className="h-4 w-4" />
                <span>Operational Restriction Enforced</span>
              </span>
            </div>
          </div>

          {/* Required Documents Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-semibold text-slate-400">
                <tr>
                  <th className="py-3 px-4">Jenis Dokumen Legalitas</th>
                  <th className="py-3 px-4">Tingkat Urgensi</th>
                  <th className="py-3 px-4">Jendela Peringatan Perpanjangan</th>
                  <th className="py-3 px-4">Dampak Pembatasan Operasional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {selectedTemplate.requiredDocuments.map((doc, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 font-bold text-[10px]">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-bold text-white">{doc.name}</p>
                          <p className="text-[10px] font-mono text-slate-400">Kode: {doc.type}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          doc.criticality === 'MANDATORY'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}
                      >
                        {doc.criticality === 'MANDATORY' ? 'Wajib (Mandatory)' : 'Disarankan (Recommended)'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Clock className="h-3.5 w-3.5 text-amber-400" />
                        <span>H-{doc.renewalWindowDays} Hari Sebelum Expired</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="text-[11px] text-slate-400">
                        {doc.criticality === 'MANDATORY'
                          ? 'Otomatis memblokir dispatch & penugasan rute antarkota bila kedaluwarsa.'
                          : 'Peringatan administratif untuk skor audit kepatuhan ISO/SMK3.'}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
