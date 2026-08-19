/**
 * Fleet Intelligence Smart AI - Inspection Templates & Checklist Builder
 * Configurable templates, category items, conditional rules, and scoring thresholds.
 */

import React, { useState } from 'react';
import { 
  FileCode, 
  Plus, 
  CheckCircle2, 
  ShieldAlert, 
  Sliders, 
  Trash2, 
  Check, 
  Edit3, 
  Layers 
} from 'lucide-react';
import { inspectionService } from '../services/inspectionService';
import { InspectionTemplate } from '../types/inspection';

export const InspectionTemplatesView: React.FC = () => {
  const [templates, setTemplates] = useState<InspectionTemplate[]>(() => inspectionService.getTemplates());
  const [selectedTemplate, setSelectedTemplate] = useState<InspectionTemplate>(templates[0]);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // New Template Form State
  const [newTemplateName, setNewTemplateName] = useState<string>('');
  const [newTemplateCode, setNewTemplateCode] = useState<string>('');
  const [newTemplateDesc, setNewTemplateDesc] = useState<string>('');

  React.useEffect(() => {
    return inspectionService.subscribe(() => {
      setTemplates(inspectionService.getTemplates());
    });
  }, []);

  const handleSaveNewTemplate = () => {
    if (!newTemplateName) return;
    const created = inspectionService.createTemplate({
      tenantId: 'tenant-1',
      name: newTemplateName,
      code: newTemplateCode || `TMPL-${Date.now().toString().slice(-4)}`,
      description: newTemplateDesc || 'Template inspeksi khusus armada',
      inspectionType: 'PRE_TRIP',
      vehicleTypes: ['truck_box', 'van'],
      categories: selectedTemplate.categories,
      rules: selectedTemplate.rules,
      scoring: { passThreshold: 85, attentionThreshold: 70 },
      signatureRequired: true,
      active: true,
      isDefault: false,
    });

    setIsCreating(false);
    setSelectedTemplate(created);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            Template & Aturan Checklist Inspeksi
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Kustomisasi daftar periksa komponen armada, bobot penilaian skor, dan aturan pemicu Grounding otomatis.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors shadow"
        >
          <Plus className="w-4 h-4" />
          Tambah Template Baru
        </button>
      </div>

      {/* Main Grid: Template List & Selected Template Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Templates */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">Daftar Template Aktif</h2>
          {templates.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => setSelectedTemplate(tmpl)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedTemplate.id === tmpl.id
                  ? 'bg-cyan-950/30 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/30'
                  : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{tmpl.name}</span>
                    {tmpl.isDefault && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">Default</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{tmpl.description}</p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>{tmpl.categories.length} Kategori • {tmpl.categories.flatMap(c => c.items).length} Item</span>
                <span className="text-cyan-400 font-mono">Passing: {tmpl.scoring.passThreshold}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right 2 Columns: Template Detail & Rules Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">{selectedTemplate.name}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Kode: {selectedTemplate.code} | Tipe: {selectedTemplate.inspectionType}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  Status: Aktif
                </span>
              </div>
            </div>

            {/* Configured Categories & Items */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Rincian Kategori Checklist
              </h4>

              <div className="space-y-4">
                {selectedTemplate.categories.map((cat, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        {cat.title}
                      </span>
                      <span className="text-[11px] text-slate-400">{cat.items.length} Komponen</span>
                    </div>

                    <div className="divide-y divide-slate-800/60 text-xs">
                      {cat.items.map((item) => (
                        <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                          <div>
                            <span className="text-slate-200 font-medium">{item.itemName}</span>
                            <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.causesGroundingIfFailed && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold">
                                Grounding Trigger
                              </span>
                            )}
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                              {item.points} Poin
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Grounding & Work Order Rules */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Smart Grounding & Automation Rules Engine
              </h4>

              <div className="space-y-2">
                {selectedTemplate.rules.map((rule) => (
                  <div key={rule.id} className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-900/40 text-xs space-y-1">
                    <div className="flex items-center justify-between text-rose-300 font-semibold">
                      <span>IF {rule.conditionField} {rule.conditionOperator} '{rule.conditionValue}'</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/30 text-rose-200">
                        {rule.action}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{rule.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white">Buat Template Inspeksi Baru</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Nama Template</label>
              <input
                type="text"
                placeholder="Contoh: Pemeriksaan Khusus Truk Tangki BBM"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Kode Template</label>
              <input
                type="text"
                placeholder="Contoh: PRE-FUEL-01"
                value={newTemplateCode}
                onChange={(e) => setNewTemplateCode(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Deskripsi</label>
              <textarea
                rows={2}
                placeholder="Deskripsi target armada dan peruntukan..."
                value={newTemplateDesc}
                onChange={(e) => setNewTemplateDesc(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveNewTemplate}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold"
              >
                Simpan Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
